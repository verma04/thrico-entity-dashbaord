"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect to terms page as there is no main settings page
export default function WallOfFameSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/wall-of-fame/settings/term_and_conditions");
  }, [router]);

  return null;
}
