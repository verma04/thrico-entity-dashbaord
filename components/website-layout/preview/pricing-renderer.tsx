import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { ModuleContainer } from "../modules/module-container";
import {
  CardsPricing,
  TablePricing,
  TogglePricing,
  GradientTierMatrix,
  LifetimeDealBanner,
  MinimalEditorialPlans,
} from "../pricing";

interface PricingRendererProps {
  module: ModuleData;
  previewDevice: string;
}

export const PricingRenderer: React.FC<PricingRendererProps> = ({ module }) => {
  const { layout, content } = module;

  const renderLayout = () => {
    switch (layout) {
      case "cards-pricing":
        return <CardsPricing content={content} />;
      case "table-pricing":
        return <TablePricing content={content} />;
      case "toggle-pricing":
        return <TogglePricing content={content} />;
      case "gradient-tier-matrix":
        return <GradientTierMatrix content={content} />;
      case "lifetime-deal-banner":
        return <LifetimeDealBanner content={content} />;
      case "minimal-editorial-plans":
        return <MinimalEditorialPlans content={content} />;
      default:
        return <CardsPricing content={content} />;
    }
  };

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      {renderLayout()}
    </ModuleContainer>
  );
};

export default PricingRenderer;
