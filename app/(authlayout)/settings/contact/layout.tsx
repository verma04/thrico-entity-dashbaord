"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(ContactLayout, "CONTACT_SUPPORT");
