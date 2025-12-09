export interface CountryPackage {
  packageId: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isPopular: boolean;
  subscriptionType: string;
  accessType: string;
  numberOfUsers: number;
  adminUsers: number;
  benefits: string[];
  currency: string;
  modules: {
    icon: string;
    name: string;
  }[];
}

export interface UpgradePlanSummary {
  monthlyPrice: string;
  yearlyPrice: string;
  creditApplied: string;
  monthsCovered: string;
  upgradeSummaryText: string;
  yearlyNextBillingDate: string;
  monthlyBillingDate: string;
  finalMonthlyPrice: string;
  finalYearlyPrice: string;
  creditAppliedMonthly: string;
  creditAppliedYearly: string;
}
