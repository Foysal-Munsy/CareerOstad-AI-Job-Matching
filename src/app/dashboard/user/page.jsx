"use client";
import React from "react";
import { useSession } from "next-auth/react";

export default function UserDashboardPage() {
  const { data: session } = useSession();
  return (
    <div>
      <h1 className="text-2xl font-bold">My Dashboard</h1>
      <p className="mt-1 text-base-content/70">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}.</p>
    </div>
  );
}


