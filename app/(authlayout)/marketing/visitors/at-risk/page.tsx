import { VisitorIntelligenceDashboard } from "@/components/marketing/visitors/visitor-intelligence-dashboard";

export default function AtRiskVisitorsPage() {
  return (
    <VisitorIntelligenceDashboard
      initialStatusFilter="AT_RISK"
      tabTitle="At Risk / Churned Visitors"
    />
  );
}
