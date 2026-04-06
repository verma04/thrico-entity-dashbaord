"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect to faq page as there is no main settings page
export default function WallOfFameSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/wall-of-fame/settings/faq");
  }, [router]);

  return null;
}
