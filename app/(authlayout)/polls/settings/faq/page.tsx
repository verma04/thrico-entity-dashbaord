"use client";

import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const PollsFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="polls"
      title="Polls FAQs"
      description="Manage frequently asked questions for the polls module"
    />
  );
};

export default PollsFaqPage;
