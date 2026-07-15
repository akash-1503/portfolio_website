import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    // Dashboard Statistics
    const [
      totalUsers,
      totalVolunteers,
      totalCampaigns,
      donation,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.volunteer.count(),
      prisma.campaign.count(),
      prisma.donation.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Dashboard data fetched successfully",

      stats: {
        totalUsers,
        totalVolunteers,
        totalCampaigns,
        totalDonations: donation._sum.amount ?? 0,
      },
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