"use client";
import React from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role || "user";
      if (role === "admin") router.replace("/dashboard/admin");
      else if (role === "company") router.replace("/dashboard/company");
      else router.replace("/dashboard/candidate");
    }
  }, [status, session, router]);

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    return null;
  }

  return null;
}



