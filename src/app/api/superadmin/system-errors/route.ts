import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";
import { ErrorSeverity, Role } from "@prisma/client";
import { logSystemError } from "../../../../lib/system-error";

/* =========================================================
   SUPER ADMIN AUTHENTICATION
========================================================= */

async function authenticateSuperAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      ),
    };
  }

  let payload: any;

  try {
    payload = verifyToken(token);
  } catch (error) {
    console.error("SUPER ADMIN JWT ERROR:", error);

    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token.",
        },
        { status: 401 }
      ),
    };
  }

  if (payload.role !== Role.SUPER_ADMIN) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Super Admin access required.",
        },
        { status: 403 }
      ),
    };
  }

  const superAdmin = await prisma.user.findFirst({
    where: {
      id: payload.id,
      role: Role.SUPER_ADMIN,
      isDeleted: false,
    },

    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!superAdmin) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Super Admin account not found.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    payload,
    superAdmin,
  };
}

/* =========================================================
   GET SYSTEM ERRORS
   GET /api/superadmin/system-errors
========================================================= */

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const search = searchParams.get("search");

    /* =====================================================
       PAGINATION
    ===================================================== */

    const rawPage = Number(
      searchParams.get("page") || "1"
    );

    const rawLimit = Number(
      searchParams.get("limit") || "20"
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
       WHERE
    ===================================================== */

    const where: any = {};

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
      where.severity = severity as ErrorSeverity;
    }

    /* =====================================================
       SEARCH
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
         ERRORS
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

          ngo: {
            select: {
              id: true,
              name: true,
            },
          },

          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },

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
         TOTAL
      =================================================== */

      prisma.systemError.count({
        where,
      }),

      /* ===================================================
         OPEN
      =================================================== */

      prisma.systemError.count({
        where: {
          resolved: false,
        },
      }),

      /* ===================================================
         CRITICAL
      =================================================== */

      prisma.systemError.count({
        where: {
          severity: ErrorSeverity.CRITICAL,
          resolved: false,
        },
      }),

      /* ===================================================
         ERROR
      =================================================== */

      prisma.systemError.count({
        where: {
          severity: ErrorSeverity.ERROR,
          resolved: false,
        },
      }),

      /* ===================================================
         RESOLVED
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

    return NextResponse.json({
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
    });
  } catch (error) {
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
      { status: 500 }
    );
  }
}

/* =========================================================
   POST SYSTEM ERROR
   POST /api/superadmin/system-errors
========================================================= */

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    /* =====================================================
       REQUEST BODY
    ===================================================== */

    let body: any;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const {
      message,
      errorType,
      endpoint,
      method,
      statusCode,
      ngoId,
      userId,
      severity,
      requestId,
      metadata,
    } = body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (
      !message ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Error message is required.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       VALIDATE SEVERITY
    ===================================================== */

    const validSeverity =
      severity === "INFO" ||
      severity === "WARNING" ||
      severity === "ERROR" ||
      severity === "CRITICAL"
        ? (severity as ErrorSeverity)
        : ErrorSeverity.ERROR;

    /* =====================================================
       CREATE SYSTEM ERROR
    ===================================================== */

    const systemError = await logSystemError({
  error: new Error(message),
  message,
  errorType: errorType || null,
  endpoint: endpoint || null,
  method: method || null,
  statusCode: statusCode ?? null,
  ngoId: ngoId || null,
  userId: userId || null,
  severity: validSeverity as ErrorSeverity,
  requestId: requestId || null,
  metadata: metadata || null,
});

    /* =====================================================
       CREATE FAILED
    ===================================================== */

    if (!systemError) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to create system error.",
        },
        { status: 500 }
      );
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          "System error recorded.",

        data: {
          error: systemError,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST SYSTEM ERROR ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to record system error.",
      },
      { status: 500 }
    );
  }
}