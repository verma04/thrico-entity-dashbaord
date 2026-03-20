import { gql } from "@apollo/client";

export const GET_SPIN_SCRATCH_STATS = gql`
  query GetSpinScratchStats {
    getSpinScratchStats {
      totalSpins
      totalScratches
      totalMatchWins
      totalTcBurned
      totalTcRewarded
      netTcBurned
      spinStatsToday {
        plays
        tcBurned
        tcRewarded
      }
      scratchStatsToday {
        plays
        tcBurned
        tcRewarded
      }
      matchWinStatsToday {
        plays
        tcBurned
        tcRewarded
      }
    }
  }
`;
