"use client";

import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const MembersFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="members"
      title="Members FAQs"
      description="Manage frequently asked questions for the members module"
    />
  );
};

export default MembersFaqPage;
