"use client";

import PlanOverview from "./plan-overview";

import MyPlan from "./my-plan";
import BuyPlan from "./buy-plan/buy-plan";

const Trail = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
            Plans and Pricing
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started immediately for free. Upgrade for more credits, usage
            and collaboration.
          </p>
        </div>

        {/* Status Alert */}
        <div className="max-w-3xl mx-auto">
          <MyPlan />
        </div>

        {/* Plan Overview */}
        <div className="flex justify-center mb-12">
          <PlanOverview />
        </div>

        {/* Buy Plan Section */}
        <BuyPlan />
      </div>
    </div>
  );
};

export default Trail;
