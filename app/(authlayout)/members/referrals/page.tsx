"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { ReferralsUI } from "@/components/members/referrals/referrals-ui";

function ReferralsPage() {
  return <ReferralsUI />;
}

export default withModulePermission(ReferralsPage, "NETWORK", "canRead");
