"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GamificationSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/gamification/settings/general");
  }, [router]);

  return null;
}
