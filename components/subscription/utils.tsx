import React from "react";
export const formatPrice = (
  monthly: number,
  yearly: number,
  isYearly: boolean,
  currency: string
) => {
  if (monthly === 0 && yearly === 0) return "Free";
  const price = isYearly ? yearly : monthly;
  const period = isYearly ? "year" : "month";
  return `${currency}${price.toLocaleString()}/${period}`;
};

import * as Icons from "lucide-react";
export const renderModuleIcon = (icon: string) => {
  if (icon) {
    const IconComponent = (
      Icons as unknown as Record<string, React.ComponentType<any>>
    )[icon];
    if (IconComponent) {
      return <IconComponent className="w-4 h-4" />;
    }
  }
  return <Icons.Settings className="w-4 h-4" />;
};
