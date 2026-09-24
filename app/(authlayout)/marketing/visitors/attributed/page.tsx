import { VisitorIntelligenceDashboard } from "@/components/marketing/visitors/visitor-intelligence-dashboard";

export default function CampaignAttributedVisitorsPage() {
  return (
    <VisitorIntelligenceDashboard
      initialStatusFilter="UTM_ATTRIBUTED"
      tabTitle="Campaign Attributed Visitors"
    />
  );
}
