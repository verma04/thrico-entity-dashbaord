import {
  StoreDiscountType,
  StoreProvider,
  StoreDiscountRule,
} from "@/graphql/actions/rewards/store";

export { StoreDiscountType, StoreProvider };
export type { StoreDiscountRule };

export type StoreRewardItem = StoreDiscountRule;

export interface SimulatedStoreVoucher {
  id: string;
  userName: string;
  userEmail: string;
  rewardTitle: string;
  storeCode: string;
  status: "ISSUED" | "REDEEMED";
  issuedAt: string;
  redeemedAt?: string;
  gameSource: string;
}
