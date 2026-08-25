import { MemberEligibility } from "../../../actions/gamification/gamification-mutation";

export interface RewardEligibilityRule {
  id: string;
  entityId: string;
  title?: string | null;
  description?: string | null;
  memberEligibility: MemberEligibility;
  membershipTierId?: string[] | null;
  eligibleTierIds?: string[] | null;
  eligibleUserIds?: string[] | null;
  eligibleSegmentIds?: string[] | null;
  eligibleRoles?: string[] | null;
  perUserLimit: number;
  totalUsageLimit: number;
  minAccountAge: number;
  minActivityRequired: number;
  blockWarnedUsers: boolean;
  cooldownPeriod: number;
  showToAllMembers?: boolean;
  isActive: boolean;
  status: string;
  metadata?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PaginatedRewardEligibilityRules {
  items: RewardEligibilityRule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateRewardEligibilityRuleInput {
  title?: string;
  description?: string;
  memberEligibility?: MemberEligibility;
  membershipTierId?: string[];
  eligibleTierIds?: string[];
  eligibleUserIds?: string[];
  eligibleSegmentIds?: string[];
  eligibleRoles?: string[];
  perUserLimit?: number;
  totalUsageLimit?: number;
  minAccountAge?: number;
  minActivityRequired?: number;
  blockWarnedUsers?: boolean;
  cooldownPeriod?: number;
  showToAllMembers?: boolean;
  isActive?: boolean;
  metadata?: string;
}

export interface UpdateRewardEligibilityRuleInput {
  title?: string;
  description?: string;
  memberEligibility?: MemberEligibility;
  membershipTierId?: string[];
  eligibleTierIds?: string[];
  eligibleUserIds?: string[];
  eligibleSegmentIds?: string[];
  eligibleRoles?: string[];
  perUserLimit?: number;
  totalUsageLimit?: number;
  minAccountAge?: number;
  minActivityRequired?: number;
  blockWarnedUsers?: boolean;
  cooldownPeriod?: number;
  showToAllMembers?: boolean;
  isActive?: boolean;
  status?: string;
  metadata?: string;
}

export interface GetRewardEligibilityRulesVariables {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetRewardEligibilityRulesResponse {
  getRewardEligibilityRules: PaginatedRewardEligibilityRules;
}

export interface GetRewardEligibilityRuleByIdVariables {
  id: string;
}

export interface GetRewardEligibilityRuleByIdResponse {
  getRewardEligibilityRuleById: RewardEligibilityRule;
}

export interface CreateRewardEligibilityRuleVariables {
  input: CreateRewardEligibilityRuleInput;
}

export interface CreateRewardEligibilityRuleResponse {
  createRewardEligibilityRule: RewardEligibilityRule;
}

export interface UpdateRewardEligibilityRuleVariables {
  id: string;
  input: UpdateRewardEligibilityRuleInput;
}

export interface UpdateRewardEligibilityRuleResponse {
  updateRewardEligibilityRule: RewardEligibilityRule;
}

export interface DeleteRewardEligibilityRuleVariables {
  id: string;
}

export interface DeleteRewardEligibilityRuleResponse {
  deleteRewardEligibilityRule: boolean;
}
