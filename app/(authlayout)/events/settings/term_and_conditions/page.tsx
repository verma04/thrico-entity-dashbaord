"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const EventsTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="events"
      title="Events Terms & Conditions"
      description="Define the terms and conditions for your events module"
      placeholder="Enter terms and conditions for events. You can use rich text formatting to organize your terms..."
    />
  );
};

export default EventsTermsPage;
