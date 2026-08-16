import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { verifyToken } from "../../../../../lib/jwt";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // =====================================================
    // 1. AUTHENTICATION & VERIFY USER
    // =====================================================
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : req.cookies.get("token")?.value || authHeader || "";

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
    // 2. READ REQUEST BODY
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
    // 3. FIND & VALIDATE EVENT
    // =====================================================
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        ngoId: user.ngoId, // Restrict strictly to user's NGO
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        status: true,
        startDate: true,
        registrationDeadline: true,
        maxParticipants: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found." },
        { status: 404 }
      );
    }

    // Check Status
    if (event.status !== "UPCOMING") {
      return NextResponse.json(
        { success: false, message: "Registration is not available for this event." },
        { status: 400 }
      );
    }

    // Check Event Date
    const now = new Date();
    if (event.startDate <= now) {
      return NextResponse.json(
        { success: false, message: "Registration is closed because the event has already started." },
        { status: 400 }
      );
    }

    // Check Registration Deadline
    if (event.registrationDeadline && now > event.registrationDeadline) {
      return NextResponse.json(
        { success: false, message: "Registration deadline has passed." },
        { status: 400 }
      );
    }

    // Check Capacity
    const registrationCount =
      event.maxParticipants !== null
        ? await prisma.eventRegistration.count({
            where: {
              eventId: event.id,
            },
          })
        : 0;

    if (event.maxParticipants !== null && registrationCount >= event.maxParticipants) {
      return NextResponse.json(
        { success: false, message: "This event has reached its maximum capacity." },
        { status: 409 }
      );
    }

    // =====================================================
    // 4. CHECK DUPLICATE REGISTRATION
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
    // 5. CREATE REGISTRATION
    // =====================================================
    const registration = await prisma.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: event.id,
      },
      select: {
        id: true,
        registeredAt: true,
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
    // 6. SUCCESS RESPONSE
    // =====================================================
    return NextResponse.json(
      {
        success: true,
        message: "Successfully registered for the event.",
        data: {
          registrationId: registration.id,
          registeredAt: registration.registeredAt.toISOString(),
          eventId: registration.event.id,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST /api/user/events-campaigns/register ERROR:", error);

    // Prisma unique constraint violation (P2002) check
    if (typeof error === "object" && error !== null && "code" in error && (error as any).code === "P2002") {
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