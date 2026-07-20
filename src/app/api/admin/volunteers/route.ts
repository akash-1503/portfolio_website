import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/jwt";
import { Role } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";

// --- HELPER: AUTHENTICATE ADMIN ---
async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("Missing JWT_SECRET");

    const payload = verifyToken(token);

    const admin = await prisma.user.findFirst({
      where: {
        id: payload.id,
        ngoId: payload.ngoId,
        role: Role.ADMIN,
        isDeleted: false,
      },
    });

    if (!admin) {
      return { error: "Access Denied", status: 403 };
    }

    return { admin };
  } catch (error) {
    return { error: "Unauthorized", status: 401 };
  }
}

// ============================================================================
// GET API Workflow: Load Volunteer Page
// ============================================================================
export async function GET() {
  try {
    const auth = await authenticateAdmin();
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }
    if (!auth.admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Find Volunteers for this NGO
    // Including the linked Volunteer profile, Attendances, and assigned Programs
    const volunteersData = await prisma.user.findMany({
      where: {
        ngoId: auth.admin.ngoId ?? undefined,
        role: Role.VOLUNTEER,
        isDeleted: false,
      },
      include: {
        volunteer: {
          include: {
            assignedPrograms: {
              // Assuming a VolunteerProgram mapping table
              include: {
                program: true,
              },
            },
          },
        },
      },
    });

    const programs = await prisma.program.findMany({
      where: {
        ngoId: auth.admin.ngoId ?? undefined,
        isDeleted: false,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        category: true,
        status: true,
      },
    });

    // Map and calculate dynamic fields
    const formattedVolunteers = volunteersData.map((user) => {
      const volProfile = user.volunteer;

      // 1. Calculate Attendance %
      const attendancePercentage = `${volProfile?.attendancePercentage ?? 0}%`;

      const bio = volProfile?.bio ?? "";
      const skills = volProfile?.skills ?? [];
      const emergencyContact = volProfile?.emergencyContact ?? "";
      const certificatesCount = volProfile?.certificatesCount ?? 0;
      const availability = volProfile?.availability ?? "";
      const hoursCompleted = volProfile?.hoursCompleted ?? 0;
      const rating = volProfile?.rating ?? null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio,
        skills,
        availability,
        emergencyContact,
        certificatesCount,
        hoursCompleted,
        image: user.image,
        rating,
        attendance: attendancePercentage,
        programs: volProfile?.assignedPrograms.map((ap: any) => ({
          id: ap.program.id,
          name: ap.program.name,
          category: ap.program.category,
          status: ap.program.status,
          assignedAt: ap.assignedAt,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      volunteers: formattedVolunteers,
      programs,
    });
  } catch (error) {
    console.error("[GET_VOLUNTEERS_ERROR]", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ============================================================================
// PATCH API Workflow: Edit Volunteer Profile & Assignments
// ============================================================================
export async function PATCH(req: Request) {
  try {
    const auth = await authenticateAdmin();
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }
    if (!auth.admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      volunteerId,
      name,
      phone,
      image,
      bio,
      skills,
      availability,
      emergencyContact,
      action,
      programId,
    } = body;

    if (!["UPDATE_PROFILE", "ASSIGN_PROGRAM", "REMOVE_PROGRAM"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Action",
        },
        {
          status: 400,
        }
      );
    }

    if (name && name.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must be at least 3 characters",
        },
        {
          status: 400,
        }
      );
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone",
        },
        {
          status: 400,
        }
      );
    }

    if (skills && !Array.isArray(skills)) {
      return NextResponse.json(
        {
          success: false,
          message: "Skills must be an array",
        },
        {
          status: 400,
        }
      );
    }

    if (!volunteerId) {
      return NextResponse.json({ success: false, message: "Volunteer ID required" }, { status: 400 });
    }

    // Verify target volunteer exists and belongs to the same NGO
    const targetUser = await prisma.user.findFirst({
      where: {
        id: volunteerId,
        role: Role.VOLUNTEER,
        isDeleted: false,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, message: "Volunteer not found" }, { status: 404 });
    }

    if (targetUser.ngoId !== auth.admin.ngoId) {
      return NextResponse.json({ success: false, message: "Access Denied: Different NGO" }, { status: 403 });
    }

const volunteerProfile = await prisma.volunteer.upsert({
  where: {
    userId: volunteerId,
  },
  update: {},
  create: {
    userId: volunteerId,
    bio: "",
    skills: [],
    availability: "",
    emergencyContact: "",
    attendancePercentage: 0,
    hoursCompleted: 0,
    certificatesCount: 0,
    rating: 0,
  },
});

    if (action === "ASSIGN_PROGRAM") {
      if (!programId) {
        return NextResponse.json(
          {
            success: false,
            message: "Program is required",
          },
          {
            status: 400,
          }
        );
      }

      const program = await prisma.program.findFirst({
        where: {
          id: programId,
          ngoId: auth.admin.ngoId!,
          isDeleted: false,
        },
      });

      if (!program) {
        return NextResponse.json(
          {
            success: false,
            message: "Program not found",
          },
          {
            status: 404,
          }
        );
      }

      const alreadyAssigned = await prisma.volunteerProgram.findFirst({
        where: {
          volunteerId: volunteerProfile.id,
          programId,
        },
      });

      if (alreadyAssigned) {
        return NextResponse.json(
          {
            success: false,
            message: "Volunteer already assigned",
          },
          {
            status: 400,
          }
        );
      }

      await prisma.volunteerProgram.create({
        data: {
          volunteerId: volunteerProfile.id,
          programId,
          assignedBy: auth.admin.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Program Assigned",
      });
    }

    if (action === "REMOVE_PROGRAM") {
      if (!programId) {
        return NextResponse.json(
          {
            success: false,
            message: "Program is required",
          },
          {
            status: 400,
          }
        );
      }

      await prisma.volunteerProgram.deleteMany({
        where: {
          volunteerId: volunteerProfile.id,
          programId,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Program Removed",
      });
    }

    if (action === "UPDATE_PROFILE") {
      // Update User (Base fields) & Volunteer (Extended profile fields)
      const updatedUser = await prisma.user.update({
        where: { id: volunteerId },
        data: {
          name: name !== undefined ? name : targetUser.name,
          phone: phone !== undefined ? phone : targetUser.phone,
          image: image !== undefined ? image : targetUser.image,
          // Upsert the linked Volunteer record to update extended fields
          volunteer: {
            upsert: {
              create: {
                bio: bio ?? "",
                skills: skills ?? [],
                availability: availability ?? "",
                emergencyContact: emergencyContact ?? "",
              },
              update: {
                bio: bio !== undefined ? bio : undefined,
                skills: skills !== undefined ? skills : undefined,
                availability: availability !== undefined ? availability : undefined,
                emergencyContact: emergencyContact !== undefined ? emergencyContact : undefined,
              },
            },
          },
        },
        include: {
          volunteer: {
            include: {
              assignedPrograms: {
                include: {
                  program: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Profile Updated",
          data: updatedUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[PATCH_VOLUNTEER_ERROR]", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ============================================================================
// DELETE API Workflow: Soft Delete Volunteer
// ============================================================================
export async function DELETE(req: Request) {
  try {
    const auth = await authenticateAdmin();
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }
    if (!auth.admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const volunteerId = searchParams.get("id");

    if (!volunteerId) {
      return NextResponse.json({ success: false, message: "Missing volunteer id" }, { status: 400 });
    }

    // Find Volunteer profile and user
    const targetUser = await prisma.user.findFirst({
      where: {
        id: volunteerId,
        role: Role.VOLUNTEER,
        isDeleted: false,
      },
    });

 const volunteerProfile = await prisma.volunteer.findUnique({
  where: {
    userId: volunteerId,
  },
});

if (!volunteerProfile) {
  return NextResponse.json(
    {
      success: false,
      message: "Volunteer profile not found",
    },
    { status: 404 }
  );
}

    if (!targetUser) {
      return NextResponse.json({ success: false, message: "Volunteer not found" }, { status: 404 });
    }

    // Verify same NGO
    if (targetUser.ngoId !== auth.admin.ngoId) {
      return NextResponse.json({ success: false, message: "Access Denied: Different NGO" }, { status: 403 });
    }

    // Soft Delete: Remove assignments first, then mark user as deleted
    await prisma.volunteerProgram.deleteMany({
      where: {
        volunteerId: volunteerProfile.id,
      },
    });

    await prisma.user.update({
      where: { id: volunteerId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

 

    return NextResponse.json({ success: true, message: "Volunteer removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("[DELETE_VOLUNTEER_ERROR]", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
  
}