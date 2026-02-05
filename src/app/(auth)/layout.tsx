"use client";

import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "../(dashboard)/layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
