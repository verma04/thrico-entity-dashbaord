import { LucideIcon } from "lucide-react";
import {
  ManualCouponType,
  ManualVoucherStatus,
} from "@/graphql/actions/rewards/manual";

export interface MockVoucherItem {
  id: string;
  code: string;
  type: ManualCouponType;
  faceValue: number;
  currency: string;
  status: ManualVoucherStatus;
  assignedTo?: string;
  assignedAt?: string;
  expiryDate: string;
}

export interface RewardExampleItem {
  type: string;
  desc: string;
  icon: LucideIcon;
  code: string;
  tag: string;
  color: string;
}

export interface KeyBenefitItem {
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
}

export interface GamificationHookItem {
  name: string;
  icon: LucideIcon;
  href: string;
}
