import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/jwt";
import { prisma } from "../../../../lib/prisma";
import { Role, EventStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    // --- 1. Authentication & Token Verification ---
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing token." },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = verifyToken(token);
      if (
  !payload ||
  !payload.id ||
  !payload.ngoId ||
  !payload.role
) {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid token payload.",
    },
    {
      status: 401,
    }
  );
}
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired token." },
        { status: 401 }
      );
    }

    // --- 2. Authorization (Role Check) ---
    if (String(payload.role) !== "VOLUNTEER") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Access restricted to Volunteers." },
        { status: 403 }
      );
    }

    // --- 3. Load User & Volunteer Profile ---
   const user = await prisma.user.findFirst({
  where: {
    id: payload.id,
    ngoId: payload.ngoId,
    isDeleted: false,
  },
  include: {
    volunteer: true,
  },
});

    if (!user || user.isDeleted || !user.volunteer) {
      return NextResponse.json(
        { success: false, message: "Not Found: Volunteer profile does not exist." },
        { status: 404 }
      );
    }

    const volunteerId = user.volunteer.id;

    // --- 4. Programs Assigned ---
    const programsAssigned = await prisma.volunteerProgram.count({
      where: { volunteerId },
    });

    // --- 5. Events Assigned ---
    const eventsAssigned = await prisma.volunteerEvent.count({
      where: { volunteerId },
    });

    // --- 6. Campaigns Assigned ---
    const volunteerPrograms = await prisma.volunteerProgram.findMany({
      where: { volunteerId },
      include: {
        program: {
          include: {
            campaigns:{
    where:{
        isDeleted:false
    }
}
          },
        },
      },
    });

    const campaignIds = new Set<string>();
    let currentProgramName = "N/A";

    volunteerPrograms.forEach((vp) => {
      // Capture at least one active program name for the profile
      if (vp.program?.name) currentProgramName = vp.program.name;
      
      vp.program?.campaigns?.forEach((c) => {
        campaignIds.add(c.id);
      });
    });
    const campaignsAssigned = campaignIds.size;

    // --- 7. Certificates ---
    // Note: Assuming a 'Certificate' table exists with a volunteerId relation
   const certificates =
await prisma.certificate.count({
    where:{
        volunteerId
    }
});

    // --- 8. Attendance % ---
    const totalAttendance = await prisma.attendance.count({
      where: { volunteerId },
    })

    const presentAttendance = await prisma.attendance.count({
      where: {
        volunteerId,
        status: "PRESENT",
      },
    })

    const attendancePercentage = totalAttendance === 0 
      ? 0 
      : Math.round((presentAttendance / totalAttendance) * 100);

    // --- 9. Hours Worked ---
    const attendanceHours = await prisma.attendance.findMany({
      where: { volunteerId },
      select: {
        id: true,
      },
    });

    const hoursWorked = attendanceHours.length;

    // --- 10. Completed & Pending Tasks ---
  const completedTasks = await prisma.volunteerEvent.count({
  where: {
    volunteerId,
    event: {
      status: "COMPLETED",
    },
  },
});

const pendingTasks = await prisma.volunteerEvent.count({
  where: {
    volunteerId,
    event: {
      status: "UPCOMING",
    },
  },
});
    // --- 11. Messages ---
    const unreadMessages = await prisma.message.count({
  where: {
    conversation: {
      members: {
        some: {
          userId: payload.id,
        },
      },
    },
    senderId: {
      not: payload.id,
    },
    isRead: false,
  },
});

    // --- 12. Today's Schedule ---
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayEventsRaw = await prisma.volunteerEvent.findMany({
      where: {
        volunteerId,
        event: {
  isDeleted: false,
  startDate: {
    gte: todayStart,
    lte: todayEnd,
  },
},
      },
      include: {
        event: true,
      },
    })

    const todaySchedule = todayEventsRaw.map((ve) => ({
      id: ve.event.id,
      title: ve.event.title || "Unnamed Event",
      location: ve.event.venue || "TBA",
      startTime: ve.event.startDate ? new Date(ve.event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBA",
      endTime: ve.event.endDate ? new Date(ve.event.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBA",
      status: ve.event.status || "UPCOMING",
    }));

    // --- 13. Notifications ---
    const notifications: any[] = [];

    // --- Final Response Assembly ---
    return NextResponse.json(
      {
        success: true,
        data: {
          volunteer: {
            id: user.volunteer.id,
            volunteerCode: `VOL-${user.id.substring(0, 6).toUpperCase()}`,
            fullName: user.name || "Volunteer",
            joinedDate: user.createdAt.toISOString(),
            designation: "Community Volunteer", // Can be dynamic if added to schema
            currentProgram: currentProgramName,
          },
          stats: {
            programsAssigned,
            eventsAssigned,
            campaignsAssigned,
            attendance: attendancePercentage,
            certificates,
            hoursWorked,
            completedTasks,
            pendingTasks,
            unreadMessages,
          },
          todaySchedule,
          notifications,
        },
      },
      { status: 200 }
    );

  } catch (error: any) {

  console.error("========== ERROR ==========");
  console.error(error);
  console.error("===========================");

  return NextResponse.json(
    {
      success: false,
      message: error.message,
      stack:
        process.env.NODE_ENV === "development"
          ? error.stack
          : undefined,
    },
    {
      status: 500,
    }
  );
}
}