import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/jwt";
import { Role } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";

// --- CONSTANTS FOR DROPDOWNS ---
const CATEGORIES = ["Environment", "Healthcare", "Education", "Disaster Relief", "Social Welfare", "Fundraising", "Other"];
const EVENT_TYPES = ["Workshop", "Drive", "Camp", "Fundraiser", "Seminar", "Other"];
const EVENT_STATUSES = ["DRAFT", "UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"];
const CAMPAIGN_STATUSES = ["DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"];
const TIMEZONES = ["Asia/Kolkata", "UTC", "America/New_York", "Europe/London"];

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
// GET API Workflow: Load Create Data OR List Merged Events & Campaigns
// ============================================================================
export async function GET(req: Request) {
  try {
    const auth = await authenticateAdmin();
    if (auth.error || !auth.admin) {
      return NextResponse.json({ success: false, message: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    // --- Fetching Initial Data for the Create Page ---
    if (action === "CREATE_DATA") {
      const programs = await prisma.program.findMany({
        where: { ngoId: auth.admin.ngoId!, isDeleted: false },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      });

      return NextResponse.json({
        success: true,
        message: "Initial data fetched successfully",
        data: {
          programs,
          categories: CATEGORIES,
          eventTypes: EVENT_TYPES,
          eventStatuses: EVENT_STATUSES,
          campaignStatuses: CAMPAIGN_STATUSES,
          timezones: TIMEZONES,
        }
      });
    }

    // --- Fetching List for Events Grid ---
    const events = await prisma.event.findMany({
      where: { ngoId: auth.admin.ngoId!, isDeleted: false },
      include: { program: true },
    });

    const campaigns = await prisma.campaign.findMany({
      where: { ngoId: auth.admin.ngoId!, isDeleted: false },
      include: { program: true },
    });

    // Map to include type identifier
    const mappedEvents = events.map(e => ({ ...e, type: "Event" }));
    const mappedCampaigns = campaigns.map(c => ({ ...c, type: "Campaign" }));

    // Merge and Sort by created Date Descending
    const combined = [...mappedEvents, ...mappedCampaigns].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      success: true,
      message: "Records fetched successfully",
      records: combined
    });

  } catch (error) {
    console.error("[GET_EVENTS_ERROR]", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ============================================================================
// POST API Workflow: Publish New Event or Campaign
// ============================================================================
export async function POST(req: Request) {
  try {
    const auth = await authenticateAdmin();
    if (auth.error || !auth.admin) {
      return NextResponse.json({ success: false, message: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const { 
      recordType, title, category, eventType, summary, description,
      venue, address, city, state, country, postalCode, googleMapUrl,
      startDate, endDate, registrationDeadline, timezone, programId,
      coverImage, status, maxParticipants, maxVolunteers, minVolunteers,
      maxGuests, goalAmount
    } = body;

    // --- VALIDATION LAYER (Before Prisma) ---
    if (!recordType || !["Event", "Campaign"].includes(recordType)) {
      return NextResponse.json({ success: false, message: "Invalid or missing recordType" }, { status: 400 });
    }
    if (!title || title.trim().length < 3) {
      return NextResponse.json({ success: false, message: "Title must be at least 3 characters" }, { status: 400 });
    }
    if (!startDate || !endDate) {
      return NextResponse.json({ success: false, message: "Start and End dates are required" }, { status: 400 });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return NextResponse.json({ success: false, message: "Start Date must be before End Date" }, { status: 400 });
    }
    
    if (registrationDeadline) {
      const regDeadline = new Date(registrationDeadline);
      if (regDeadline >= start) {
        return NextResponse.json({ success: false, message: "Registration deadline must be before start date" }, { status: 400 });
      }
    }

    if (recordType === "Event" && !venue) {
      return NextResponse.json({ success: false, message: "Venue is required for Events" }, { status: 400 });
    }
    
    if (recordType === "Event" && !category) {
      return NextResponse.json({ success: false, message: "Category is required for Events" }, { status: 400 });
    }

    if (goalAmount !== undefined && goalAmount <= 0) {
      return NextResponse.json({ success: false, message: "Goal amount must be greater than zero" }, { status: 400 });
    }

    if (maxParticipants !== undefined && maxParticipants < 0) {
      return NextResponse.json({ success: false, message: "Participants cannot be negative" }, { status: 400 });
    }

    if (maxVolunteers !== undefined && maxVolunteers < 0) {
      return NextResponse.json({ success: false, message: "Volunteers count cannot be negative" }, { status: 400 });
    }

    // Program validation
    if (programId) {
      const validProgram = await prisma.program.findFirst({
        where: { id: programId as string, ngoId: auth.admin.ngoId!, isDeleted: false }
      });
      if (!validProgram) return NextResponse.json({ success: false, message: "Invalid Program ID" }, { status: 400 });
    }

    // --- PRISMA CREATION ---
    if (recordType === "Event") {
      const newEvent = await prisma.event.create({
        data: {
          ngoId: auth.admin.ngoId!,
          createdBy: auth.admin.id,
          title,
          category,
          eventType: eventType || "Other",
          summary: summary || "",
          description: description || "",
          venue,
          address: address || "",
          city: city || "",
          state: state || "",
          country: country || "",
          postalCode: postalCode || "",
          googleMapUrl: googleMapUrl || "",
          startDate: start,
          endDate: end,
          registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
          timezone: timezone || "Asia/Kolkata",
          programId: programId || null,
          coverImage: coverImage || null,
          status: status || "DRAFT",
          maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
          maxVolunteers: maxVolunteers ? parseInt(maxVolunteers) : null,
          minVolunteers: minVolunteers ? parseInt(minVolunteers) : null,
          maxGuests: maxGuests ? parseInt(maxGuests) : null,
        }
      });
      return NextResponse.json({ success: true, message: "Event created successfully", data: newEvent });
    } 
    
    if (recordType === "Campaign") {
      const newCampaign = await prisma.campaign.create({
        data: {
          ngoId: auth.admin.ngoId!,
          createdBy: auth.admin.id,
          title,
          description: description || "",
          programId: programId || null,
          goalAmount: goalAmount ? parseFloat(goalAmount) : 0,
          coverImage: coverImage || null,
          status: status || "DRAFT",
          startDate: start,
          endDate: end,
        }
      });
      return NextResponse.json({ success: true, message: "Campaign created successfully", data: newCampaign });
    }

  } catch (error) {
    console.error("[POST_EVENTS_ERROR]", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ============================================================================
// PATCH API Workflow: Update, Change Status, or Assign Program
// ============================================================================
export async function PATCH(req: Request) {
  try {
    const auth = await authenticateAdmin();
    if (auth.error || !auth.admin) {
      return NextResponse.json({ success: false, message: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const { action, recordType, id, ...updateData } = body;

    if (!action || !recordType || !id) {
      return NextResponse.json({ success: false, message: "Missing required identification fields" }, { status: 400 });
    }

    // Verify ownership
    const model = recordType === "Event" ? prisma.event : prisma.campaign;
    const existingRecord = await (model as any).findFirst({
      where: { id, ngoId: auth.admin.ngoId, isDeleted: false }
    });

    if (!existingRecord) {
      return NextResponse.json({ success: false, message: `${recordType} not found or access denied` }, { status: 404 });
    }

    // --- HANDLE ACTIONS ---
    switch (action) {
      case "UPDATE": {
        // Safe mapping of fields to prevent unintended data overwrites
        const updateFields: any = {};
        
        if (updateData.title !== undefined) updateFields.title = updateData.title;
        if (updateData.description !== undefined) updateFields.description = updateData.description;
        if (updateData.category !== undefined) updateFields.category = updateData.category;
        if (updateData.eventType !== undefined) updateFields.eventType = updateData.eventType;
        if (updateData.summary !== undefined) updateFields.summary = updateData.summary;
        if (updateData.venue !== undefined) updateFields.venue = updateData.venue;
        if (updateData.address !== undefined) updateFields.address = updateData.address;
        if (updateData.city !== undefined) updateFields.city = updateData.city;
        if (updateData.state !== undefined) updateFields.state = updateData.state;
        if (updateData.country !== undefined) updateFields.country = updateData.country;
        if (updateData.postalCode !== undefined) updateFields.postalCode = updateData.postalCode;
        if (updateData.googleMapUrl !== undefined) updateFields.googleMapUrl = updateData.googleMapUrl;
        if (updateData.timezone !== undefined) updateFields.timezone = updateData.timezone;
        if (updateData.coverImage !== undefined) updateFields.coverImage = updateData.coverImage;
        
        // Safely parse numbers and dates
        if (updateData.startDate) updateFields.startDate = new Date(updateData.startDate);
        if (updateData.endDate) updateFields.endDate = new Date(updateData.endDate);
        if (updateData.registrationDeadline) updateFields.registrationDeadline = new Date(updateData.registrationDeadline);
        
        if (updateData.maxParticipants !== undefined) updateFields.maxParticipants = parseInt(updateData.maxParticipants);
        if (updateData.maxVolunteers !== undefined) updateFields.maxVolunteers = parseInt(updateData.maxVolunteers);
        if (updateData.minVolunteers !== undefined) updateFields.minVolunteers = parseInt(updateData.minVolunteers);
        if (updateData.maxGuests !== undefined) updateFields.maxGuests = parseInt(updateData.maxGuests);
        if (updateData.goalAmount !== undefined) updateFields.goalAmount = parseFloat(updateData.goalAmount);

        const updatedRecord = await (model as any).update({ 
          where: { id }, 
          data: updateFields 
        });

        return NextResponse.json({ success: true, message: `${recordType} updated successfully`, data: updatedRecord });
      }

      case "CHANGE_STATUS":
        if (!updateData.status) {
          return NextResponse.json({ success: false, message: "Status required" }, { status: 400 });
        }
        await (model as any).update({ where: { id }, data: { status: updateData.status } });
        return NextResponse.json({ success: true, message: "Status updated", data: null });

      case "ASSIGN_PROGRAM":
        if (!updateData.programId) {
          return NextResponse.json({ success: false, message: "Program ID required" }, { status: 400 });
        }
        await (model as any).update({ where: { id }, data: { programId: updateData.programId } });
        return NextResponse.json({ success: true, message: "Program assigned successfully", data: null });

      case "REMOVE_PROGRAM":
        await (model as any).update({ where: { id }, data: { programId: null } });
        return NextResponse.json({ success: true, message: "Program removed successfully", data: null });

      default:
        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }

  } catch (error) {
    console.error("[PATCH_EVENTS_ERROR]", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ============================================================================
// DELETE API Workflow: Soft Delete Event or Campaign
// ============================================================================
export async function DELETE(req: Request) {
  try {
    const auth = await authenticateAdmin();
    if (auth.error || !auth.admin) {
      return NextResponse.json({ success: false, message: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "Event" or "Campaign"

    if (!id || !type || !["Event", "Campaign"].includes(type)) {
      return NextResponse.json({ success: false, message: "Valid ID and Type are required" }, { status: 400 });
    }

    const model = type === "Event" ? prisma.event : prisma.campaign;

    // Verify ownership
    const existingRecord = await (model as any).findFirst({
      where: { id, ngoId: auth.admin.ngoId, isDeleted: false }
    });

    if (!existingRecord) {
      return NextResponse.json({ success: false, message: "Record not found or access denied" }, { status: 404 });
    }

    // Soft delete
    await (model as any).update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    });

    return NextResponse.json({ success: true, message: `${type} deleted successfully`, data: null });

  } catch (error) {
    console.error("[DELETE_EVENTS_ERROR]", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}