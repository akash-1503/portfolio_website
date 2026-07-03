"use client";

import React from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Navbar from "@/components/Navbar/Navbar";

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden relative">
        <DashboardLayout>{children}</DashboardLayout>
      </div>
    </div>
  );
}
