"use client";

import React from "react";
import { Customer360Dashboard } from "@/components/members/customer-360/customer-360-dashboard";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function MemberCustomer360Page() {
  return <Customer360Dashboard />;
}

export default withModulePermission(MemberCustomer360Page, "MEMBERS_ALL", "canRead");
