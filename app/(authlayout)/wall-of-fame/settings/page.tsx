"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect to faq page as there is no main settings page
function WallOfFameSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/wall-of-fame/settings/faq");
  }, [router]);

  return null;
}

export default withSubscriptionCheck(
  withModulePermission(WallOfFameSettingsPage, "WALL_OF_FAME", "canEdit"),
  "wall-of-fame"
);
