import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";
import { Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

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
          message: "Unauthorized.",
        },
        { status: 401 }
      ),
    };
  }

  let payload: any;

  try {
    payload = verifyToken(token);
  } catch (error) {
    console.error("JWT verification failed:", error);

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
          message: "Access denied. Super Admin only.",
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
   GET ADMINS + NGOs
   GET /api/superadmin/admins
========================================================= */

export async function GET(req: NextRequest) {
  try {
    /* -----------------------------------------------------
       1. AUTHENTICATION
    ----------------------------------------------------- */

    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    /* -----------------------------------------------------
       2. QUERY PARAMETERS
    ----------------------------------------------------- */

    const { searchParams } = new URL(req.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const ngoId =
      searchParams.get("ngoId")?.trim() || "";

    /* -----------------------------------------------------
       3. BUILD ADMIN WHERE
    ----------------------------------------------------- */

    const where: any = {
      role: Role.ADMIN,
      isDeleted: false,
    };

    /*
     * If ngoId is supplied, return admins
     * attached to that NGO.
     */

    if (ngoId) {
      where.ngoId = ngoId;
    }

    /*
     * Search by:
     * - Admin name
     * - Admin email
     * - NGO name
     */

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
          ngo: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    /* -----------------------------------------------------
       4. FETCH ADMINS
    ----------------------------------------------------- */

    const admins = await prisma.user.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,

        role: true,
        status: true,

        ngoId: true,

        isDeleted: true,

        createdAt: true,
        updatedAt: true,

        /*
         * User.ngoId -> NGO.id
         */

        ngo: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
            state: true,
            country: true,
          },
        },
      },
    });

    /* -----------------------------------------------------
       5. FETCH ALL ACTIVE NGOs
       
       IMPORTANT:
       This query is independent of admins.
       
       Therefore it also works when:
       
       NGO exists
       +
       No ADMIN exists yet
       
       This is what allows the FIRST ADMIN to be created.
    ----------------------------------------------------- */

    const ngos = await prisma.nGO.findMany({
      where: {
        isDeleted: false,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        state: true,
      },
    });

    /* -----------------------------------------------------
       6. RESPONSE
       
       Both pages now receive the data they need:
       
       Admin Management:
         data.admins
       
       Create Admin:
         data.ngos
    ----------------------------------------------------- */

    return NextResponse.json(
      {
        success: true,

        data: {
          admins,
          ngos,
          total: admins.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET /api/superadmin/admins ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load administrators.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   POST CREATE ADMIN
   POST /api/superadmin/admins
========================================================= */

export async function POST(req: NextRequest) {
  try {
    /* -----------------------------------------------------
       1. AUTHENTICATION
    ----------------------------------------------------- */

    const auth = await authenticateSuperAdmin(req);

    if ("error" in auth) {
      return auth.error;
    }

    /* -----------------------------------------------------
       2. READ REQUEST BODY
    ----------------------------------------------------- */

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
      password,
      ngoId,
    } = body;

    /* -----------------------------------------------------
       3. VALIDATION
    ----------------------------------------------------- */

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin name is required.",
        },
        { status: 400 }
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin email is required.",
        },
        { status: 400 }
      );
    }

    if (
      !password ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (
      !ngoId ||
      typeof ngoId !== "string" ||
      !ngoId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "NGO ID is required.",
        },
        { status: 400 }
      );
    }

    const cleanName = name.trim();

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const cleanNgoId = ngoId.trim();

    /* -----------------------------------------------------
       4. CHECK EMAIL
    ----------------------------------------------------- */

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: cleanEmail,
        },

        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isDeleted: true,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A user with this email already exists.",
        },
        { status: 409 }
      );
    }

    /* -----------------------------------------------------
       5. CHECK NGO
    ----------------------------------------------------- */

    const ngo = await prisma.nGO.findFirst({
      where: {
        id: cleanNgoId,
        isDeleted: false,
      },

      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        state: true,
      },
    });

    if (!ngo) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected NGO does not exist or has been deleted.",
        },
        { status: 404 }
      );
    }

    /* -----------------------------------------------------
       6. HASH PASSWORD
    ----------------------------------------------------- */

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    /* -----------------------------------------------------
       7. CREATE ADMIN
    ----------------------------------------------------- */

    const admin = await prisma.user.create({
      data: {
        name: cleanName,

        email: cleanEmail,

        password: hashedPassword,

        role: Role.ADMIN,

        status: UserStatus.ACTIVE,

        /*
         * Connect admin to the EXISTING NGO.
         *
         * User.ngoId === NGO.id
         */

        ngoId: ngo.id,

        isDeleted: false,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        ngoId: true,
        createdAt: true,

        ngo: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
            state: true,
          },
        },
      },
    });

    /* -----------------------------------------------------
       8. RESPONSE
    ----------------------------------------------------- */

    return NextResponse.json(
      {
        success: true,

        message:
          "Administrator created successfully.",

        data: {
          admin,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/superadmin/admins ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create administrator.",
      },
      { status: 500 }
    );
  }
}