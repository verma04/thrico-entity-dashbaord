import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust Center & Safety Hub | Thrico",
  description: "Centralized moderation, support tickets, policy acknowledgements, alerts, and announcement broadcast telemetry.",
};

export default function TrustCenterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
