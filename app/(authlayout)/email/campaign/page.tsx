"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CampaignRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/email/campaigns");
  }, [router]);

  return null;
}
