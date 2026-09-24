import { VisitorIntelligenceDashboard } from "@/components/marketing/visitors/visitor-intelligence-dashboard";

export default function ConvertedMembersPage() {
  return (
    <VisitorIntelligenceDashboard
      initialStatusFilter="CONVERTED"
      tabTitle="Converted Members"
    />
  );
}
