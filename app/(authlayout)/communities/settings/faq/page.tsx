"use client";

import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const FaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="communities"
      title="Community FAQs"
      description="Manage frequently asked questions for the communities module"
    />
  );
};

export default FaqPage;
