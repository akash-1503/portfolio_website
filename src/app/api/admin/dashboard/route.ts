import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,

    stats: {
      totalDonations: 1528450,
      activeVolunteers: 520,
      activeCampaigns: 18,
      totalUsers: 42,
    },
  });
}