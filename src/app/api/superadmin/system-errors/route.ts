import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { logSystemError } from "../../../../lib/system-error";
import { authenticateSuperAdmin } from "../../../../lib/auth/super-admin";
import { ErrorSeverity, Prisma } from "@prisma/client";

/* =========================================================
   GET SYSTEM ERRORS

   GET /api/superadmin/system-errors

   Query Parameters:

   ?page=1
   ?limit=20
   ?status=OPEN
   ?status=RESOLVED
   ?severity=INFO
   ?severity=WARNING
   ?severity=ERROR
   ?severity=CRITICAL
   ?search=something
========================================================= */

export async function GET(req: NextRequest) {
  try {
    /* =====================================================
       SUPER ADMIN AUTHENTICATION
    ===================================================== */

    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    /* =====================================================
       QUERY PARAMETERS
    ===================================================== */

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const search = searchParams.get("search");

    /* =====================================================
       PAGINATION
    ===================================================== */

    const rawPage = Number(
      searchParams.get("page") ?? "1"
    );

    const rawLimit = Number(
      searchParams.get("limit") ?? "20"
    );

    const page =
      Number.isFinite(rawPage) && rawPage > 0
        ? Math.floor(rawPage)
        : 1;

    const limit =
      Number.isFinite(rawLimit) && rawLimit > 0
        ? Math.min(Math.floor(rawLimit), 100)
        : 20;

    const skip = (page - 1) * limit;

    /* =====================================================
       WHERE CLAUSE
    ===================================================== */

    const where: Prisma.SystemErrorWhereInput = {};

    /* =====================================================
       STATUS FILTER
    ===================================================== */

    if (status === "OPEN") {
      where.resolved = false;
    }

    if (status === "RESOLVED") {
      where.resolved = true;
    }

    /* =====================================================
       SEVERITY FILTER
    ===================================================== */

    if (
      severity === "INFO" ||
      severity === "WARNING" ||
      severity === "ERROR" ||
      severity === "CRITICAL"
    ) {
      where.severity =
        severity as ErrorSeverity;
    }

    /* =====================================================
       SEARCH FILTER
    ===================================================== */

    if (search?.trim()) {
      const searchValue = search.trim();

      where.OR = [
        {
          message: {
            contains: searchValue,
            mode: "insensitive",
          },
        },
        {
          endpoint: {
            contains: searchValue,
            mode: "insensitive",
          },
        },
        {
          errorType: {
            contains: searchValue,
            mode: "insensitive",
          },
        },
        {
          requestId: {
            contains: searchValue,
            mode: "insensitive",
          },
        },
      ];
    }

    /* =====================================================
       DATABASE QUERIES
    ===================================================== */

    const [
      errors,
      total,
      openCount,
      criticalCount,
      errorCount,
      resolvedCount,
    ] = await Promise.all([
      /* ===================================================
         ERROR LIST
      =================================================== */

      prisma.systemError.findMany({
        where,

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: limit,

        select: {
          id: true,

          ngoId: true,
          userId: true,

          method: true,
          endpoint: true,
          statusCode: true,

          errorType: true,
          message: true,
          stack: true,

          requestId: true,
          metadata: true,

          severity: true,

          resolved: true,
          resolvedAt: true,
          resolvedById: true,

          createdAt: true,

          /* -----------------------------------------------
             NGO
          ----------------------------------------------- */

          ngo: {
            select: {
              id: true,
              name: true,
            },
          },

          /* -----------------------------------------------
             USER
          ----------------------------------------------- */

          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },

          /* -----------------------------------------------
             RESOLVED BY
          ----------------------------------------------- */

          resolvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),

      /* ===================================================
         TOTAL FILTERED ERRORS
      =================================================== */

      prisma.systemError.count({
        where,
      }),

      /* ===================================================
         TOTAL OPEN ERRORS
      =================================================== */

      prisma.systemError.count({
        where: {
          resolved: false,
        },
      }),

      /* ===================================================
         TOTAL OPEN CRITICAL ERRORS
      =================================================== */

      prisma.systemError.count({
        where: {
          severity: ErrorSeverity.CRITICAL,
          resolved: false,
        },
      }),

      /* ===================================================
         TOTAL OPEN ERROR-SEVERITY ERRORS
      =================================================== */

      prisma.systemError.count({
        where: {
          severity: ErrorSeverity.ERROR,
          resolved: false,
        },
      }),

      /* ===================================================
         TOTAL RESOLVED ERRORS
      =================================================== */

      prisma.systemError.count({
        where: {
          resolved: true,
        },
      }),
    ]);

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        data: {
          errors,

          pagination: {
            page,
            limit,
            total,
            totalPages:
              total === 0
                ? 0
                : Math.ceil(total / limit),
          },

          statistics: {
            open: openCount,
            critical: criticalCount,
            error: errorCount,
            resolved: resolvedCount,
          },
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    /* =====================================================
       DATABASE / SERVER ERROR
    ===================================================== */

    console.error(
      "========== GET SYSTEM ERRORS ERROR =========="
    );

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to load system errors.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST SYSTEM ERROR

   POST /api/superadmin/system-errors

   Used for MANUAL system-error creation.

   Automatic application errors should normally use
   logSystemError() directly instead of calling this route.
========================================================= */

export async function POST(req: NextRequest) {
  try {
    /* =====================================================
       SUPER ADMIN AUTHENTICATION
    ===================================================== */

    const auth =
      await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    /* =====================================================
       REQUEST BODY
    ===================================================== */

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid JSON request body.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDATE OBJECT
    ===================================================== */

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Request body must be a JSON object.",
        },
        {
          status: 400,
        }
      );
    }

    const data =
      body as Record<string, unknown>;

    /* =====================================================
       MESSAGE
    ===================================================== */

    const message =
      typeof data.message === "string"
        ? data.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Error message is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       ERROR TYPE
    ===================================================== */

    const errorType =
      typeof data.errorType === "string" &&
      data.errorType.trim()
        ? data.errorType.trim()
        : undefined;

    /* =====================================================
       ENDPOINT
    ===================================================== */

    const endpoint =
      typeof data.endpoint === "string" &&
      data.endpoint.trim()
        ? data.endpoint.trim()
        : undefined;

    /* =====================================================
       METHOD
    ===================================================== */

    const method =
      typeof data.method === "string" &&
      data.method.trim()
        ? data.method
            .trim()
            .toUpperCase()
        : undefined;

    /* =====================================================
       STATUS CODE
    ===================================================== */

    let statusCode:
      | number
      | undefined;

    if (data.statusCode !== undefined) {
      if (
        typeof data.statusCode !== "number" ||
        !Number.isInteger(
          data.statusCode
        ) ||
        data.statusCode < 100 ||
        data.statusCode > 599
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid HTTP status code.",
          },
          {
            status: 400,
          }
        );
      }

      statusCode = data.statusCode;
    }

    /* =====================================================
       NGO ID
    ===================================================== */

    const ngoId =
      typeof data.ngoId === "string" &&
      data.ngoId.trim()
        ? data.ngoId.trim()
        : null;

    /* =====================================================
       USER ID
    ===================================================== */

    const userId =
      typeof data.userId === "string" &&
      data.userId.trim()
        ? data.userId.trim()
        : null;

    /* =====================================================
       REQUEST ID
    ===================================================== */

    const requestId =
      typeof data.requestId === "string" &&
      data.requestId.trim()
        ? data.requestId.trim()
        : undefined;

    /* =====================================================
       SEVERITY
    ===================================================== */

    let validSeverity:
      ErrorSeverity =
      ErrorSeverity.ERROR;

    if (
      data.severity === "INFO" ||
      data.severity === "WARNING" ||
      data.severity === "ERROR" ||
      data.severity === "CRITICAL"
    ) {
      validSeverity =
        data.severity as ErrorSeverity;
    }

    /* =====================================================
       METADATA
    ===================================================== */

    let metadata:
      | Prisma.InputJsonValue
      | undefined;

    if (
      data.metadata !== undefined
    ) {
      const metadataValue =
        data.metadata;

      if (
        metadataValue === null
      ) {
        metadata = undefined;
      } else if (
        typeof metadataValue ===
          "object" ||
        typeof metadataValue ===
          "string" ||
        typeof metadataValue ===
          "number" ||
        typeof metadataValue ===
          "boolean"
      ) {
        metadata =
          metadataValue as Prisma.InputJsonValue;
      }
    }

    /* =====================================================
       CREATE SYSTEM ERROR
    ===================================================== */

    const systemError =
      await logSystemError({
        error: new Error(message),

        message,

        errorType,

        endpoint,

        method,

        statusCode,

        ngoId,

        userId,

        severity:
          validSeverity,

        requestId,

        metadata,
      });

    /* =====================================================
       LOGGING FAILED
    ===================================================== */

    if (!systemError) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to create system error.",
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          "System error recorded successfully.",

        data: {
          error: systemError,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    /* =====================================================
       SERVER ERROR
    ===================================================== */

    console.error(
      "========== POST SYSTEM ERROR ERROR =========="
    );

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to record system error.",
      },
      {
        status: 500,
      }
    );
  }
}