"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DonorLayout from "@/components/Dashboard/DonorLayout";
import VolunteerLayout from "@/components/Dashboard/VolunteerLayout";
import Navbar from "@/components/Navbar/Navbar";

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getLayout = () => {
    // Check the current path to render the appropriate layout
    if (pathname?.startsWith("/user")) {
      return <DonorLayout>{children}</DonorLayout>;
    } else if (pathname?.startsWith("/volunteer")) {
      return <VolunteerLayout>{children}</VolunteerLayout>;
    }
    // Default to Admin layout for /admin and any other dashboard routes
    return <DashboardLayout>{children}</DashboardLayout>;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden relative">
        {getLayout()}
      </div>
    </div>
  );
}
