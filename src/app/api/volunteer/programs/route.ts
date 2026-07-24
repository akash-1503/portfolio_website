import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/jwt";
import { Role } from "@prisma/client";

import {
  VolunteerService,
  VolunteerNotFoundError,
} from "../../../../services/volunteer.service";


// ============================================================================
// CONTROLLER LAYER
// Responsibility: HTTP Request/Response, Auth Extraction, Role Checking
// ============================================================================
export async function GET() {
  try {
    // --- Step 1 & 2: Read Cookie ---
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing Token" }, 
        { status: 401 }
      );
    }

    // --- Step 3: Verify JWT ---
    let payload;
    try {
      payload = verifyToken(token);
      if (!payload?.id || !payload?.ngoId || !payload?.role) {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid token payload",
    },
    {
      status: 401,
    }
  );
}
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired authentication token."}, 
        { status: 401 }
      );
    }

    // --- Step 4: Authorization ---
    if (payload.role !== Role.VOLUNTEER) {
      return NextResponse.json(
        { success: false, message: "You do not have permission to access this resource."}, 
        { status: 403 }
      );
    }

    // --- Step 5 & 6: Call Service Layer ---
  const data = await VolunteerService.getAssignedPrograms(
  payload.id,
  payload.ngoId
);

return NextResponse.json(
  {
    success: true,
    message: "Assigned programs fetched successfully.",
    count: data.length,
    data,
  },
  {
    status: 200,
  }
);

  } catch (error) {
  console.error("[VOLUNTEER_GET_PROGRAMS_ERROR]", error);

  if (error instanceof VolunteerNotFoundError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    {
      status: 500,
    }
  );
} 
}