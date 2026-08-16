"use client";

import React from "react";
import DashboardLayout from "@/src/components/Dashboard/DashboardLayout";

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
