import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Manager",
  description: "Handle member support tickets, resolve issues, and track resolution metrics.",
};

export default function SupportManagerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
