import React from "react";
import Upgrade from "./upgrade/upgrade";
import PlanOverview from "./plan-overview";

const PaidPlan = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-6">
      <PlanOverview />
      <Upgrade />
    </div>
  );
};

export default PaidPlan;
