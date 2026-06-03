"use client";

import User from "@/components/members/users/user";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const page = () => {
  return <User status={"ALL"} />;
};

export default withModulePermission(page, "NETWORK", "canRead");
