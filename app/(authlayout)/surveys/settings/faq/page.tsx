"use client";

import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const SurveysFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="surveys"
      title="Surveys FAQs"
      description="Manage frequently asked questions for the surveys module"
    />
  );
};

export default SurveysFaqPage;
