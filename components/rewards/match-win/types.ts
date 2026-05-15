export type PrizeType = "COINS" | "TC" | "VOUCHER" | "PREMIUM" | "NO_REWARDS" | "NOTHING";

export interface MatchWinSymbol {
  id?: string;
  key: string;
  label: string;
  icon: string;
  color: string;
}

export interface MatchWinCombination {
  id?: string;
  key: string;
  type: PrizeType;
  value: number;
  probability: number;
  maxWins: number;
  rewardId?: string;
  symbol1Id?: string;
  symbol2Id?: string;
  symbol3Id?: string;
}
