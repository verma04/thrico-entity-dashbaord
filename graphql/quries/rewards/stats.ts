import { gql } from "@apollo/client";

export const GET_SPIN_SCRATCH_STATS = gql`
  query GetSpinScratchStats($timeRange: String, $dateRange: DateRangeInput) {
    getSpinScratchStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalSpins
      totalScratches
      totalMatchWins
      totalTcBurned
      totalTcRewarded
      totalUniqueMembers
      spinStats {
        plays
        tcBurned
        tcRewarded
      }
      scratchStats {
        plays
        tcBurned
        tcRewarded
      }
      matchWinStats {
        plays
        tcBurned
        tcRewarded
      }
    }
  }
`;
