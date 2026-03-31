import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learnings",
  description: "Curate and publish educational resources for your community members.",
};

export default function LearningsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
