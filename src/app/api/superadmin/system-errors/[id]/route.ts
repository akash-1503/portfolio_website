import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { verifyToken } from "../../../../../lib/jwt";
import { Role, ErrorSeverity } from "@prisma/client";

/* =========================================================
   AUTHENTICATE SUPER ADMIN
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
      role: true,
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
   GET SINGLE SYSTEM ERROR
========================================================= */

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    const { id } = await context.params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        {
          success: false,
          message: "System error ID is required.",
        },
        { status: 400 }
      );
    }

    const systemError =
      await prisma.systemError.findUnique({
        where: {
          id,
        },

        select: {
          id: true,

          /* Error information */
          errorType: true,
          message: true,
          stack: true,

          /* Request information */
          method: true,
          endpoint: true,
          statusCode: true,
          requestId: true,

          /* Debug information */
          metadata: true,

          /* Severity */
          severity: true,

          /* Resolution */
          resolved: true,
          resolvedAt: true,
          resolvedById: true,

          /* Dates */
          createdAt: true,

          /* NGO */
          ngo: {
            select: {
              id: true,
              name: true,
            },
          },

          /* User who triggered error */
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },

          /* Admin who resolved error */
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

    if (!systemError) {
      return NextResponse.json(
        {
          success: false,
          message: "System error not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,

      data: {
        error: systemError,
      },
    });
  } catch (error) {
    console.error(
      "GET SINGLE SYSTEM ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load system error.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   PATCH SYSTEM ERROR

   Supported:

   1. Resolve
      {
        "resolved": true
      }

   2. Reopen
      {
        "resolved": false
      }

   3. Change severity
      {
        "severity": "INFO"
      }

   4. Resolve + severity
      {
        "resolved": true,
        "severity": "CRITICAL"
      }
========================================================= */

export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    /* -------------------------------------------------------
       AUTH
    ------------------------------------------------------- */

    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    /* -------------------------------------------------------
       PARAMETER
    ------------------------------------------------------- */

    const { id } = await context.params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        {
          success: false,
          message: "System error ID is required.",
        },
        { status: 400 }
      );
    }

    /* -------------------------------------------------------
       BODY
    ------------------------------------------------------- */

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

    /* -------------------------------------------------------
       EXISTING ERROR
    ------------------------------------------------------- */

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
        { status: 404 }
      );
    }

    /* -------------------------------------------------------
       UPDATE DATA
    ------------------------------------------------------- */

    const updateData: {
      resolved?: boolean;
      resolvedAt?: Date | null;
      resolvedById?: string | null;
      severity?: ErrorSeverity;
    } = {};

    /* =======================================================
       RESOLVED FIELD
    ======================================================= */

    if (typeof body.resolved === "boolean") {
      if (body.resolved === true) {
        updateData.resolved = true;
        updateData.resolvedAt = new Date();
        updateData.resolvedById =
          auth.superAdmin.id;
      } else {
        updateData.resolved = false;
        updateData.resolvedAt = null;
        updateData.resolvedById = null;
      }
    }

    /* =======================================================
       BACKWARD COMPATIBILITY

       Also allow:

       {
         "status": "RESOLVED"
       }

       or

       {
         "status": "OPEN"
       }
    ======================================================= */

    if (body.status === "RESOLVED") {
      updateData.resolved = true;
      updateData.resolvedAt = new Date();
      updateData.resolvedById =
        auth.superAdmin.id;
    }

    if (body.status === "OPEN") {
      updateData.resolved = false;
      updateData.resolvedAt = null;
      updateData.resolvedById = null;
    }

    /* =======================================================
       SEVERITY

       Prisma enum:

       INFO
       WARNING
       ERROR
       CRITICAL
    ======================================================= */

    if (
      body.severity === "INFO" ||
      body.severity === "WARNING" ||
      body.severity === "ERROR" ||
      body.severity === "CRITICAL"
    ) {
      updateData.severity =
        body.severity as ErrorSeverity;
    }

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No valid update fields were provided.",
        },
        { status: 400 }
      );
    }

    /* -------------------------------------------------------
       UPDATE DATABASE
    ------------------------------------------------------- */

    const updated =
      await prisma.systemError.update({
        where: {
          id,
        },

        data: updateData,

        select: {
          id: true,

          errorType: true,
          message: true,
          stack: true,

          method: true,
          endpoint: true,
          statusCode: true,
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
      });

    /* -------------------------------------------------------
       RESPONSE
    ------------------------------------------------------- */

    return NextResponse.json({
      success: true,

      message:
        "System error updated successfully.",

      data: {
        error: updated,
      },
    });
  } catch (error) {
    console.error(
      "PATCH SYSTEM ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update system error.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE SYSTEM ERROR
========================================================= */

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const auth =
      await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    const { id } =
      await context.params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        {
          success: false,
          message:
            "System error ID is required.",
        },
        { status: 400 }
      );
    }

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
          message:
            "System error not found.",
        },
        { status: 404 }
      );
    }

    await prisma.systemError.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,

      message:
        "System error deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE SYSTEM ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete system error.",
      },
      { status: 500 }
    );
  }
}