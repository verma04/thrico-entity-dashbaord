import { VisitorIntelligenceDashboard } from "@/components/marketing/visitors/visitor-intelligence-dashboard";

export default function KnownVisitorsPage() {
  return (
    <VisitorIntelligenceDashboard
      initialStatusFilter="ACTIVE"
      tabTitle="Known Visitors"
    />
  );
}
