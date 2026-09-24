import { VisitorIntelligenceDashboard } from "@/components/marketing/visitors/visitor-intelligence-dashboard";

export default function AllVisitorsPage() {
  return (
    <VisitorIntelligenceDashboard
      initialStatusFilter="ALL"
      tabTitle="All Visitors"
    />
  );
}
