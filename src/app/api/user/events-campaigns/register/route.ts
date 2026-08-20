import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma"; 
import { verifyToken } from "../../../../../lib/jwt"; 
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // =====================================================
    // 1. AUTHENTICATION
    // =====================================================
    const token = req.cookies.get("token")?.value ?? "";

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // =====================================================
    // 2. VERIFY USER & AUTHORIZATION
    // =====================================================
    if (payload.role !== "USER") {
      return NextResponse.json(
        { success: false, message: "Access denied. Invalid role." },
        { status: 403 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
        ngoId: payload.ngoId,
        role: Role.USER,
        isDeleted: false,
      },
      select: {
        id: true,
        ngoId: true,
      },
    });

    if (!user || !user.ngoId) {
      return NextResponse.json(
        { success: false, message: "Access denied. Invalid user or NGO association." },
        { status: 403 }
      );
    }

    // =====================================================
    // 3. READ REQUEST BODY
    // =====================================================
    const body = await req.json();
    const { eventId } = body;

    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json(
        { success: false, message: "Event ID is required." },
        { status: 400 }
      );
    }

    // =====================================================
    // 4. FIND & VALIDATE EVENT
    // =====================================================
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        ngoId: user.ngoId, // Crucial: Restrict strictly to user's NGO
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        status: true,
        startDate: true,
        maxParticipants: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found." },
        { status: 404 }
      );
    }

    // =====================================================
// 4. VALIDATE EVENT REGISTRATION
// =====================================================

const now = new Date();

// Event must be UPCOMING or ACTIVE
if (
  event.status !== "UPCOMING" &&
  event.status !== "ACTIVE"
) {
  return NextResponse.json(
    {
      success: false,
      message: "Registration is not available for this event.",
    },
    { status: 400 }
  );
}

// Capacity check
if (event.maxParticipants !== null) {
  const registrationCount =
    await prisma.eventRegistration.count({
      where: {
        eventId: event.id,
      },
    });

  if (registrationCount >= event.maxParticipants) {
    return NextResponse.json(
      {
        success: false,
        message: "This event has reached its maximum capacity.",
      },
      { status: 409 }
    );
  }
}

    // =====================================================
    // 5. CHECK DUPLICATE REGISTRATION
    // =====================================================
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: event.id,
        },
      },
      select: {
        id: true,
        registeredAt: true,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          message: "You are already registered for this event.",
          data: {
            registrationId: existingRegistration.id,
            registeredAt: existingRegistration.registeredAt.toISOString(),
          },
        },
        { status: 409 }
      );
    }

    // =====================================================
    // 6. CREATE REGISTRATION
    // =====================================================
    const registration = await prisma.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: event.id,
      },
      select: {
        id: true,
        registeredAt: true,
        eventId: true,
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
          },
        },
      },
    });

    // =====================================================
    // 7. SUCCESS RESPONSE
    // =====================================================
    return NextResponse.json(
      {
        success: true,
        message: "Successfully registered for the event.",
        data: {
          registrationId: registration.id,
          eventId: registration.eventId,
          registeredAt: registration.registeredAt.toISOString(),
          event: {
            id: registration.event.id,
            title: registration.event.title,
            startDate: registration.event.startDate.toISOString(),
          },
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST /api/user/events-campaigns/register ERROR:", error);

    // Prisma unique constraint violation (P2002) safety catch
    if (
      typeof error === "object" && 
      error !== null && 
      "code" in error && 
      (error as any).code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "You are already registered for this event." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to register for the event." },
      { status: 500 }
    );
  }
}