import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    // Dashboard Statistics
    const [
      totalUsers,
      totalVolunteers,
      totalPrograms,
      donation,
      events,
      campaigns,
      recentDonationsRaw,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.volunteer.count(),

      prisma.program.count(),

      prisma.donation.aggregate({
        _sum: {
          amount: true,
        },
      }),

      prisma.event.findMany({
        where: {
          isDeleted: false,
        },
        orderBy: {
          startDate: "asc",
        },
        take: 5,
      }),

      prisma.campaign.findMany({
        where: {
          isDeleted: false,
        },
        orderBy: {
          startDate: "asc",
        },
        take: 5,
      }),

      prisma.donation.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          campaign: true,
        },
      }),
    ]);

    const eventActivities = events.map((event) => ({
      id: event.id,
      type: "EVENT",
      title: event.title,
      date: event.startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: event.startDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: event.venue ?? event.city ?? "N/A",
      status: event.status,
    }));

    const campaignActivities = campaigns.map((campaign) => ({
      id: campaign.id,
      type: "CAMPAIGN",
      title: campaign.title,
      date: campaign.startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: "",
      location: "Campaign",
      status: campaign.status,
    }));

    const activities = [
      ...eventActivities,
      ...campaignActivities,
    ].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

    // Format recent donations to match your frontend Dashboard UI
    const recentDonations = recentDonationsRaw.map((d) => ({
      name: d.user?.name || "Unknown",
      campaign: d.campaign?.title || "General",
      date: d.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amount: `₹${d.amount.toLocaleString()}`,
    }));

    return NextResponse.json({
      success: true,
      message: "Dashboard data fetched successfully",
      stats: {
        totalUsers,
        totalVolunteers,
        totalPrograms,
        totalDonations: donation._sum.amount ?? 0,
      },
      activities,
      recentDonations,
      monthlyDonations: [20, 35, 40, 50, 65, 75, 80, 60, 50, 45, 30, 25],
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}