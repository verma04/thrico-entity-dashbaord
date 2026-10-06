import React from "react";
import { AuthProtocolTabView } from "@/components/members/customization/views";

export const metadata = {
  title: "Authentication & SSO | Member Customization",
  description:
    "Configure member authentication protocols, Google SSO, and email OTP verification.",
};

export default function AuthProtocolPage() {
  return <AuthProtocolTabView />;
}
