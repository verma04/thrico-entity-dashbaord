import React from "react";
import { AuthTextTabView } from "@/components/members/customization/views";

export const metadata = {
  title: "Login & Signup Text | Member Customization",
  description:
    "Customize headlines, descriptions, button labels, and footer copy on member login and signup forms.",
};

export default function AuthTextPage() {
  return <AuthTextTabView />;
}
