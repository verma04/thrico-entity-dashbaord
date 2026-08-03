import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export const USER_GAMIFICATION_SUMMARY = gql`
  query GetUserGamificationSummary {
    getUserGamificationSummary {
      totalPoints
      weekPoints
      monthPoints
      totalBadges
      totalRanks
      weeklyGrowth
    }
  }
`;

export const GET_POINT_RULE = gql`
  query GetPointRule($module: String!, $action: String!) {
    getPointRule(module: $module, action: $action) {
      id
      module
      action
      points
      description
      isActive
    }
  }
`;

export type PointRuleData = {
  getPointRule: {
    id: string;
    module: string;
    action: string;
    points: number;
    description: string;
    isActive: boolean;
  };
};

export type PointRuleVars = {
  module: string;
  action: string;
};

export const useGetPointRule = (variables: PointRuleVars) => {
  return useQuery<PointRuleData, PointRuleVars>(GET_POINT_RULE, {
    variables,
    skip: !variables.module || !variables.action,
  });
};

export type UserGamificationSummaryData = {
  getUserGamificationSummary: {
    totalPoints: number;
    weekPoints: number;
    monthPoints: number;
    totalBadges: number;
    totalRanks: number;
    weeklyGrowth: number;
  };
};

export const useGetUserGamificationSummary = () => {
  return useQuery<UserGamificationSummaryData>(USER_GAMIFICATION_SUMMARY);
};
