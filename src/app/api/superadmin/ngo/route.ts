import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";
import { Role } from "@prisma/client";

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
   GET NGOs
   GET /api/superadmin/ngo
========================================================= */

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id")?.trim() || "";
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "ALL";

    /* =====================================================
       GET SINGLE NGO DETAILS
       GET /api/superadmin/ngo?id=NGO_ID
    ===================================================== */

    if (id) {
      const ngo = await prisma.nGO.findFirst({
        where: {
          id,
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          website: true,
          address: true,
          city: true,
          state: true,
          country: true,
          postalCode: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!ngo) {
        return NextResponse.json(
          {
            success: false,
            message: "NGO not found.",
          },
          { status: 404 }
        );
      }

      /* ===================================================
         USERS ATTACHED TO THIS NGO
      =================================================== */

      const users = await prisma.user.findMany({
        where: {
          ngoId: ngo.id,
          isDeleted: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
          status: true,
          ngoId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      /* ===================================================
         ADMINS ATTACHED TO THIS NGO

         IMPORTANT:
         Admin is connected through:
         User.ngoId === NGO.id
      =================================================== */

      const admins = await prisma.user.findMany({
        where: {
          ngoId: ngo.id,
          role: Role.ADMIN,
          isDeleted: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
          status: true,
          ngoId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      /* ===================================================
         STATISTICS
      =================================================== */

      const [
        userCount,
        programCount,
        campaignCount,
        eventCount,
        donationCount,
      ] = await Promise.all([
        prisma.user.count({
          where: {
            ngoId: ngo.id,
            isDeleted: false,
            role: {
              not: Role.SUPER_ADMIN,
            },
          },
        }),

        prisma.program.count({
          where: {
            ngoId: ngo.id,
          },
        }),

        prisma.campaign.count({
          where: {
            ngoId: ngo.id,
          },
        }),

        prisma.event.count({
          where: {
            ngoId: ngo.id,
          },
        }),

        prisma.donation.count({
          where: {
            ngoId: ngo.id,
          },
        }),
      ]);

      /* ===================================================
         ROLE COUNTS
      =================================================== */

      const adminCount = admins.length;

      const volunteerCount = users.filter(
        (user) => user.role === Role.VOLUNTEER
      ).length;

      const normalUserCount = users.filter(
        (user) => user.role === Role.USER
      ).length;

      return NextResponse.json({
        success: true,

        data: {
          ngo,

          statistics: {
            users: userCount,
            admins: adminCount,
            volunteers: volunteerCount,
            normalUsers: normalUserCount,
            programs: programCount,
            campaigns: campaignCount,
            events: eventCount,
            donations: donationCount,
          },

          admins,

          users,
        },
      });
    }

    /* =====================================================
       NGO LIST
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

    const where: any = {
      isDeleted: false,
    };

    if (status === "ACTIVE") {
      /*
       Your current NGO schema does not have isActive.
       Therefore ACTIVE means not deleted.
      */
    }

    if (status === "INACTIVE") {
      /*
       Your current NGO schema has no isActive field.
       Returning no records for INACTIVE is safer than
       querying a nonexistent Prisma field.
      */

      where.id = "__NO_INACTIVE_NGO__";
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          state: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    /* =====================================================
       FETCH NGO LIST
    ===================================================== */

    const [ngos, total] = await Promise.all([
      prisma.nGO.findMany({
        where,

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: limit,

        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          website: true,
          address: true,
          city: true,
          state: true,
          country: true,
          postalCode: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      prisma.nGO.count({
        where,
      }),
    ]);

    /* =====================================================
       GET COUNTS FOR EACH NGO
    ===================================================== */

    const ngoData = await Promise.all(
      ngos.map(async (ngo) => {
        const [
          users,
          admins,
          programs,
          campaigns,
          events,
          donations,
        ] = await Promise.all([
          prisma.user.count({
            where: {
              ngoId: ngo.id,
              isDeleted: false,
              role: {
                not: Role.SUPER_ADMIN,
              },
            },
          }),

          prisma.user.count({
            where: {
              ngoId: ngo.id,
              role: Role.ADMIN,
              isDeleted: false,
            },
          }),

          prisma.program.count({
            where: {
              ngoId: ngo.id,
            },
          }),

          prisma.campaign.count({
            where: {
              ngoId: ngo.id,
            },
          }),

          prisma.event.count({
            where: {
              ngoId: ngo.id,
            },
          }),

          prisma.donation.count({
            where: {
              ngoId: ngo.id,
            },
          }),
        ]);

        return {
          ...ngo,

          statistics: {
            users,
            admins,
            programs,
            campaigns,
            events,
            donations,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,

      data: {
        ngos: ngoData,

        pagination: {
          page,
          limit,
          total,
          totalPages:
            total === 0
              ? 0
              : Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error(
      "GET SUPER ADMIN NGO ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load NGOs.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   POST NGO
   POST /api/superadmin/ngo
========================================================= */

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

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
      name,
      email,
      phone,
      website,
      address,
      city,
      state,
      country,
      postalCode,
      description,
    } = body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "NGO name is required.",
        },
        { status: 400 }
      );
    }

    const cleanName = name.trim();

    const cleanEmail =
      typeof email === "string"
        ? email.trim().toLowerCase() || null
        : null;

    /* =====================================================
       DUPLICATE CHECK
    ===================================================== */

    const duplicateConditions: any[] = [
      {
        name: cleanName,
      },
    ];

    if (cleanEmail) {
      duplicateConditions.push({
        email: cleanEmail,
      });
    }

    const existing = await prisma.nGO.findFirst({
      where: {
        isDeleted: false,
        OR: duplicateConditions,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An NGO with this name or email already exists.",
        },
        { status: 409 }
      );
    }

    /* =====================================================
       CREATE
    ===================================================== */

    const ngo = await prisma.nGO.create({
      data: {
        name: cleanName,

        email: cleanEmail,

        phone:
          typeof phone === "string"
            ? phone.trim() || null
            : null,

        website:
          typeof website === "string"
            ? website.trim() || null
            : null,

        address:
          typeof address === "string"
            ? address.trim() || null
            : null,

        city:
          typeof city === "string"
            ? city.trim() || null
            : null,

        state:
          typeof state === "string"
            ? state.trim() || null
            : null,

        country:
          typeof country === "string"
            ? country.trim() || null
            : null,

        postalCode:
          typeof postalCode === "string"
            ? postalCode.trim() || null
            : null,

        description:
          typeof description === "string"
            ? description.trim() || null
            : null,

        isDeleted: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "NGO created successfully.",
        data: {
          ngo,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE NGO ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create NGO.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   PATCH NGO
   PATCH /api/superadmin/ngo
========================================================= */

export async function PATCH(req: NextRequest) {
  try {
    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

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
      id,
      name,
      email,
      phone,
      website,
      address,
      city,
      state,
      country,
      postalCode,
      description,
    } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "NGO ID is required.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.nGO.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "NGO not found.",
        },
        { status: 404 }
      );
    }

    const cleanName =
      typeof name === "string"
        ? name.trim()
        : existing.name;

    if (!cleanName) {
      return NextResponse.json(
        {
          success: false,
          message: "NGO name is required.",
        },
        { status: 400 }
      );
    }

    const cleanEmail =
      typeof email === "string"
        ? email.trim().toLowerCase() || null
        : null;

    /* =====================================================
       DUPLICATE CHECK
    ===================================================== */

    const duplicate = await prisma.nGO.findFirst({
      where: {
        id: {
          not: id,
        },

        isDeleted: false,

        OR: [
          {
            name: cleanName,
          },

          ...(cleanEmail
            ? [
                {
                  email: cleanEmail,
                },
              ]
            : []),
        ],
      },

      select: {
        id: true,
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Another NGO with this name or email already exists.",
        },
        { status: 409 }
      );
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    const ngo = await prisma.nGO.update({
      where: {
        id,
      },

      data: {
        name: cleanName,

        email: cleanEmail,

        phone:
          typeof phone === "string"
            ? phone.trim() || null
            : null,

        website:
          typeof website === "string"
            ? website.trim() || null
            : null,

        address:
          typeof address === "string"
            ? address.trim() || null
            : null,

        city:
          typeof city === "string"
            ? city.trim() || null
            : null,

        state:
          typeof state === "string"
            ? state.trim() || null
            : null,

        country:
          typeof country === "string"
            ? country.trim() || null
            : null,

        postalCode:
          typeof postalCode === "string"
            ? postalCode.trim() || null
            : null,

        description:
          typeof description === "string"
            ? description.trim() || null
            : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "NGO updated successfully.",
      data: {
        ngo,
      },
    });
  } catch (error) {
    console.error(
      "UPDATE NGO ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update NGO.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE NGO
   Soft Delete
   DELETE /api/superadmin/ngo
========================================================= */

export async function DELETE(req: NextRequest) {
  try {
    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

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

    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "NGO ID is required.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.nGO.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "NGO not found.",
        },
        { status: 404 }
      );
    }

    /* =====================================================
       SOFT DELETE
    ===================================================== */

    await prisma.nGO.update({
      where: {
        id,
      },

      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "NGO deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE NGO ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete NGO.",
      },
      { status: 500 }
    );
  }
}