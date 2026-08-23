import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { ErrorSeverity } from "@prisma/client";
import { authenticateSuperAdmin } from "../../../../../lib/auth/super-admin";

/* =========================================================
   GET SINGLE SYSTEM ERROR

   GET /api/superadmin/system-errors/[id]
========================================================= */

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    /* =====================================================
       SUPER ADMIN AUTHENTICATION
    ===================================================== */

    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    /* =====================================================
       GET PARAMETER
    ===================================================== */

    const { id } = await context.params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        {
          success: false,
          message: "System error ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       FIND SYSTEM ERROR
    ===================================================== */

    const systemError =
      await prisma.systemError.findUnique({
        where: {
          id,
        },

        select: {
          /* -------------------------------------------------
             BASIC
          ------------------------------------------------- */

          id: true,

          /* -------------------------------------------------
             ERROR INFORMATION
          ------------------------------------------------- */

          errorType: true,
          message: true,
          stack: true,

          /* -------------------------------------------------
             REQUEST INFORMATION
          ------------------------------------------------- */

          method: true,
          endpoint: true,
          statusCode: true,
          requestId: true,

          /* -------------------------------------------------
             DEBUG INFORMATION
          ------------------------------------------------- */

          metadata: true,

          /* -------------------------------------------------
             SEVERITY
          ------------------------------------------------- */

          severity: true,

          /* -------------------------------------------------
             RESOLUTION
          ------------------------------------------------- */

          resolved: true,
          resolvedAt: true,
          resolvedById: true,

          /* -------------------------------------------------
             DATE
          ------------------------------------------------- */

          createdAt: true,

          /* -------------------------------------------------
             NGO
          ------------------------------------------------- */

          ngo: {
            select: {
              id: true,
              name: true,
            },
          },

          /* -------------------------------------------------
             USER WHO TRIGGERED ERROR
          ------------------------------------------------- */

          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },

          /* -------------------------------------------------
             SUPER ADMIN WHO RESOLVED ERROR
          ------------------------------------------------- */

          resolvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

    /* =====================================================
       NOT FOUND
    ===================================================== */

    if (!systemError) {
      return NextResponse.json(
        {
          success: false,
          message: "System error not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        data: {
          error: systemError,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    /* =====================================================
       SERVER ERROR
    ===================================================== */

    console.error(
      "========== GET SINGLE SYSTEM ERROR =========="
    );

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to load system error.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH SYSTEM ERROR

   PATCH /api/superadmin/system-errors/[id]

   Supported:

   Resolve:
   {
     "resolved": true
   }

   Reopen:
   {
     "resolved": false
   }

   Change severity:
   {
     "severity": "CRITICAL"
   }

   Resolve + severity:
   {
     "resolved": true,
     "severity": "CRITICAL"
   }

   Backward compatibility:

   {
     "status": "RESOLVED"
   }

   {
     "status": "OPEN"
   }
========================================================= */

export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    /* =====================================================
       SUPER ADMIN AUTHENTICATION
    ===================================================== */

    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    /* =====================================================
       GET PARAMETER
    ===================================================== */

    const { id } = await context.params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        {
          success: false,
          message: "System error ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       READ REQUEST BODY
    ===================================================== */

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDATE BODY
    ===================================================== */

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Request body must be a JSON object.",
        },
        {
          status: 400,
        }
      );
    }

    const data = body as Record<string, unknown>;

    /* =====================================================
       FIND EXISTING ERROR
    ===================================================== */

    const existing =
      await prisma.systemError.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          resolved: true,
          severity: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "System error not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       UPDATE DATA
    ===================================================== */

    const updateData: {
      resolved?: boolean;
      resolvedAt?: Date | null;
      resolvedById?: string | null;
      severity?: ErrorSeverity;
    } = {};

    /* =====================================================
       RESOLVED
    ===================================================== */

    if (typeof data.resolved === "boolean") {
      if (data.resolved === true) {
        updateData.resolved = true;

        updateData.resolvedAt =
          new Date();

        updateData.resolvedById =
          auth.superAdmin.id;
      } else {
        updateData.resolved = false;

        updateData.resolvedAt = null;

        updateData.resolvedById = null;
      }
    }

    /* =====================================================
       BACKWARD COMPATIBILITY - STATUS
    ===================================================== */

    if (data.status === "RESOLVED") {
      updateData.resolved = true;

      updateData.resolvedAt =
        new Date();

      updateData.resolvedById =
        auth.superAdmin.id;
    }

    if (data.status === "OPEN") {
      updateData.resolved = false;

      updateData.resolvedAt = null;

      updateData.resolvedById = null;
    }

    /* =====================================================
       SEVERITY
    ===================================================== */

    if (
      data.severity === "INFO" ||
      data.severity === "WARNING" ||
      data.severity === "ERROR" ||
      data.severity === "CRITICAL"
    ) {
      updateData.severity =
        data.severity as ErrorSeverity;
    }

    /* =====================================================
       VALIDATE UPDATE
    ===================================================== */

    if (
      Object.keys(updateData).length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No valid update fields were provided.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       UPDATE SYSTEM ERROR
    ===================================================== */

    const updated =
      await prisma.systemError.update({
        where: {
          id,
        },

        data: updateData,

        select: {
          /* -------------------------------------------------
             BASIC
          ------------------------------------------------- */

          id: true,

          /* -------------------------------------------------
             ERROR INFORMATION
          ------------------------------------------------- */

          errorType: true,
          message: true,
          stack: true,

          /* -------------------------------------------------
             REQUEST
          ------------------------------------------------- */

          method: true,
          endpoint: true,
          statusCode: true,
          requestId: true,

          /* -------------------------------------------------
             DEBUG
          ------------------------------------------------- */

          metadata: true,

          /* -------------------------------------------------
             SEVERITY
          ------------------------------------------------- */

          severity: true,

          /* -------------------------------------------------
             RESOLUTION
          ------------------------------------------------- */

          resolved: true,
          resolvedAt: true,
          resolvedById: true,

          /* -------------------------------------------------
             DATE
          ------------------------------------------------- */

          createdAt: true,

          /* -------------------------------------------------
             NGO
          ------------------------------------------------- */

          ngo: {
            select: {
              id: true,
              name: true,
            },
          },

          /* -------------------------------------------------
             USER
          ------------------------------------------------- */

          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },

          /* -------------------------------------------------
             RESOLVED BY
          ------------------------------------------------- */

          resolvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

    /* =====================================================
       SUCCESS
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          "System error updated successfully.",

        data: {
          error: updated,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    /* =====================================================
       SERVER ERROR
    ===================================================== */

    console.error(
      "========== PATCH SYSTEM ERROR =========="
    );

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update system error.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE SYSTEM ERROR

   DELETE /api/superadmin/system-errors/[id]
========================================================= */

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
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
       GET PARAMETER
    ===================================================== */

    const { id } = await context.params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        {
          success: false,
          message: "System error ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       FIND EXISTING ERROR
    ===================================================== */

    const existing =
      await prisma.systemError.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "System error not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       DELETE
    ===================================================== */

    await prisma.systemError.delete({
      where: {
        id,
      },
    });

    /* =====================================================
       SUCCESS
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          "System error deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    /* =====================================================
       SERVER ERROR
    ===================================================== */

    console.error(
      "========== DELETE SYSTEM ERROR =========="
    );

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to delete system error.",
      },
      {
        status: 500,
      }
    );
  }
}