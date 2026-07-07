"use client";

import React from "react";
import DashboardLayout from "@/src/components/Dashboard/DashboardLayout";
import Navbar from "@/src/components/Navbar/Navbar";

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa] pt-[73px]">
      <Navbar />
      {/* 
        Padding-top on the outer container accounts for the fixed navbar height.
        Navbar has py-4 (16px * 2) + Logo (40px) + border (1px) = 73px.
      */}
      <div className="flex-1 overflow-hidden relative">
        <DashboardLayout>{children}</DashboardLayout>
      </div>
    </div>
  );
}
