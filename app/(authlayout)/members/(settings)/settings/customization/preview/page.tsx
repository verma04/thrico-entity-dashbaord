import React from "react";
import { PreviewTabView } from "@/components/members/customization/views";

export const metadata = {
  title: "Onboarding Simulator | Member Customization",
  description:
    "Live simulator mirroring the exact member registration and login modals across web and mobile.",
};

export default function PreviewPage() {
  return <PreviewTabView />;
}
