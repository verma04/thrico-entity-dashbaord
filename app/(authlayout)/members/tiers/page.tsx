"use client";

import MembershipTiers from "@/components/members/settings/membership-tiers";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const page = () => {
  return <MembershipTiers />;
};

export default withModulePermission(page, "MEMBERS_ALL", "canRead");

