import { VisitorIntelligenceDashboard } from "@/components/marketing/visitors/visitor-intelligence-dashboard";

export default function AnonymousVisitorsPage() {
  return (
    <VisitorIntelligenceDashboard
      initialStatusFilter="ANONYMOUS"
      tabTitle="Anonymous (Ghost Visitors)"
    />
  );
}
