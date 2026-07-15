import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../lib/prisma"; 
import { verifyToken } from "../../../../lib/jwt";
import { Role } from "@prisma/client";

// --- HELPER: AUTHENTICATE ADMIN ---
async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Step 2: Read Cookie (If missing -> 401)
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  try {

    // Step 3: Verify JWT
    const payload = verifyToken(token);

    // Step 4: Verify logged-in user in DB
   const admin = await prisma.user.findFirst({
    where:{
        id:payload.id,
        ngoId:payload.ngoId,
        role:Role.ADMIN,
        isDeleted:false
    }
});

    if (!admin) {
      return { error: "Access Denied", status: 403 };
    }

  return {
    admin,
    ngoId: admin.ngoId,
};
  } catch (error) {
    return { error: "Unauthorized", status: 401 };
  }
}

// ============================================================================
// GET API Workflow: Display all users belonging to the logged-in admin's NGO
// ============================================================================
export async function GET() {
  try {
    const auth = await authenticateAdmin();
    if ("error" in auth) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    // Step 5: Find Users (Same NGO, Role in USER/VOLUNTEER, isDeleted = false)
    const users = await prisma.user.findMany({
      where: {
        ngoId: auth.admin.ngoId,
        role: {
    in: [Role.USER, Role.VOLUNTEER],
},
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
    createdAt: true,
},
    });

    // Step 6: Return
   return NextResponse.json(
    {
        success: true,
        users,
    },
    {
        status: 200,
    }
);

  } catch (error) {
    console.error("[GET_USERS_ERROR]", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ============================================================================
// PATCH API Workflow: Change Role (Make Volunteer / Remove Volunteer)
// ============================================================================
export async function PATCH(req: Request) {
  try {
    // Step 1 & 2: Read Cookie & Verify Admin
    const auth = await authenticateAdmin();
    if ("error" in auth) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Step 3: Find Target User & ensure same NGO
    const targetUser = await prisma.user.findUnique({
    where: {
        id: userId,
    },
});

if (!targetUser || targetUser.isDeleted) {
    return NextResponse.json(
        {
            success: false,
            message: "User not found",
        },
        {
            status: 404,
        }
    );
}

    if (!targetUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (targetUser.ngoId !== auth.admin.ngoId) {
      return NextResponse.json({ success: false, message: "Access Denied: Different NGO" }, { status: 403 });
    }

    // Step 4: Never allow modifying ADMIN or SUPER_ADMIN
    if (targetUser.role === Role.ADMIN || targetUser.role === Role.SUPER_ADMIN) {
      return NextResponse.json({ success: false, message: "Cannot modify Admin roles" }, { status: 403 });
    }

    // Step 5: Process Action
    let newRole = targetUser.role;
if (
    action !== "MAKE_VOLUNTEER" &&
    action !== "REMOVE_VOLUNTEER"
) {
    return NextResponse.json(
        {
            success:false,
            message:"Invalid Action"
        },
        {
            status:400
        }
    );
}
if (
    action === "MAKE_VOLUNTEER" &&
    targetUser.role === Role.VOLUNTEER
) {
    return NextResponse.json(
        {
            success: false,
            message: "User is already a volunteer",
        },
        {
            status: 400,
        }
    );
}

if (
    action === "REMOVE_VOLUNTEER" &&
    targetUser.role === Role.USER
) {
    return NextResponse.json(
        {
            success: false,
            message: "User is already a user",
        },
        {
            status: 400,
        }
    );
}
    // Update in DB
 if (action === "MAKE_VOLUNTEER") {
    newRole = Role.VOLUNTEER;
} else {
    newRole = Role.USER;
}

const updatedUser = await prisma.user.update({
    where: {
        id: userId,
    },
    data: {
        role: newRole,
    },
    select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        status: true,
        createdAt: true,
    },
});


    // Return Success
   return NextResponse.json(
    {
        success: true,
        message: "Role Updated Successfully",
        user: updatedUser,
    },
    {
        status: 200,
    }
);

  } catch (error) {
    console.error("[PATCH_USERS_ERROR]", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ============================================================================
// DELETE API Workflow: Soft Delete User
// ============================================================================
export async function DELETE(req: Request) {
  try {
    // Read JWT & Verify Admin
    const auth = await authenticateAdmin();
    if ("error" in auth) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    // Find User
    const targetUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!targetUser || targetUser.isDeleted) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Same NGO?
    if (targetUser.ngoId !== auth.admin.ngoId) {
      return NextResponse.json({ success: false, message: "Access Denied: Different NGO" }, { status: 403 });
    }

    // Protect Admin Roles
    if (targetUser.role === Role.ADMIN || targetUser.role === Role.SUPER_ADMIN) {
      return NextResponse.json({ success: false, message: "Cannot delete Admin accounts" }, { status: 403 });
    }

    // Soft Delete: isDeleted = true
    await prisma.user.update({
      where: { id: userId },
      data: { 
        isDeleted: true,
        deletedAt: new Date(), 
      },
    });

    // Return Success
    return NextResponse.json({ success: true, message: "User removed successfully" }, { status: 200 });

  } catch (error) {
    console.error("[DELETE_USERS_ERROR]", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}