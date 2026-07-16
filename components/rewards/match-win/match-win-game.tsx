"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Info,
  Coins,
  RefreshCw,
  Trophy,
  Star,
  Gift,
  Ticket,
  Crown,
  Zap,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetMatchWinConfig,
  useGetMatchWinData,
  usePlayMatchWin,
  useGetSpinScratchStats,
} from "@/graphql/actions/rewards";
import confetti from "canvas-confetti";

interface MatchWinSymbol {
  key: string;
  label: string;
  icon: string;
  color: string;
}

const SYMBOL_ICONS: Record<string, any> = {
  Star: <Star className="h-full w-full" />,
  Trophy: <Trophy className="h-full w-full" />,
  Gift: <Gift className="h-full w-full" />,
  Coins: <Coins className="h-full w-full" />,
  Ticket: <Ticket className="h-full w-full" />,
  Crown: <Crown className="h-full w-full" />,
  Zap: <Zap className="h-full w-full" />,
  XCircle: <XCircle className="h-full w-full" />,
};

interface ReelProps {
  isSpinning: boolean;
  finalSymbol: MatchWinSymbol | null;
  symbols: MatchWinSymbol[];
}

function Reel({ isSpinning, finalSymbol, symbols }: ReelProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isSpinning && symbols.length > 0) {
      interval = setInterval(() => {
        setOffset((prev) => (prev + 1) % symbols.length);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSpinning, symbols.length]);

  return (
    <div className="relative w-24 h-32 md:w-32 md:h-44 bg-white rounded-2xl shadow-lg border-2 border-slate-100 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={isSpinning ? `spinning-${offset}` : finalSymbol?.key || "empty"}
          initial={{ y: isSpinning ? 50 : 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{
            duration: isSpinning ? 0.1 : 0.5,
            type: isSpinning ? "tween" : "spring",
            bounce: 0.4,
          }}
          className="flex flex-col items-center justify-center p-2"
        >
          <div
            className="w-12 h-12 md:w-16 md:h-16"
            style={{
              color: isSpinning ? "#CBD5E1" : finalSymbol?.color || "#94A3B8",
            }}
          >
            {isSpinning ? (
              SYMBOL_ICONS[symbols[offset]?.icon] || (
                <Star className="h-full w-full" />
              )
            ) : finalSymbol ? (
              SYMBOL_ICONS[finalSymbol.icon] || (
                <Star className="h-full w-full" />
              )
            ) : (
              <div className="animate-pulse bg-slate-100 rounded-full h-full w-full" />
            )}
          </div>
          {!isSpinning && finalSymbol && (
            <span className="text-[10px] md:text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
              {finalSymbol.label}
            </span>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-200/50 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-200/50 to-transparent pointer-events-none" />
    </div>
  );
}

export function MatchWinGame() {
  const { data: configData } = useGetMatchWinConfig();
  const { data: gameData } = useGetMatchWinData();
  const { data: statsData, refetch: refetchStats } = useGetSpinScratchStats();
  const [playMutation] = usePlayMatchWin();

  const config = configData?.getMatchWinConfig;
  const stats = statsData?.getSpinScratchStats;
  const allSymbols = gameData?.getMatchWinConfig?.settings?.symbols || [];

  const [isSpinning, setIsSpinning] = useState(false);
  const [results, setResults] = useState<[any | null, any | null, any | null]>([
    null,
    null,
    null,
  ]);
  const [showResult, setShowResult] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [winningSymbol, setWinningSymbol] = useState<any | null>(null);

  const playsLeftToday = config
    ? config.maxPlaysPerDay - (stats?.matchWinStatsToday?.plays || 0)
    : 0;

  const handlePlay = async () => {
    if (isSpinning || playsLeftToday <= 0) {
      if (playsLeftToday <= 0) toast.error("Daily limit reached!");
      return;
    }

    try {
      setIsSpinning(true);
      setShowResult(false);
      setIsWin(false);
      setWinningSymbol(null);
      setResults([null, null, null]);

      const { data } = await playMutation();
      const playResult = data?.playMatchWin;

      if (!playResult) throw new Error("Failed to play");

      const symbolLabels = playResult.symbolsWon.split(",");
      const finalSymbols = symbolLabels.map((label: string) => {
        const trimmed = label.trim();
        return (
          allSymbols.find(
            (s: any) => s.label === trimmed || s.key === trimmed,
          ) || allSymbols[0]
        );
      });

      // Sequence the stops
      setTimeout(
        () => setResults((prev) => [finalSymbols[0], prev[1], prev[2]]),
        1500,
      );
      setTimeout(
        () => setResults((prev) => [prev[0], finalSymbols[1], prev[2]]),
        2200,
      );
      setTimeout(() => {
        setResults((prev) => [prev[0], prev[1], finalSymbols[2]]);
        setIsSpinning(false);

        if (playResult.prizeType !== "NOTHING") {
          setIsWin(true);
          setWinningSymbol({
            type: playResult.prizeType,
            value: playResult.prizeValue,
            ...playResult.prize,
          });
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#3b82f6", "#10b981", "#fbbf24"],
          });
        }
        setShowResult(true);
        refetchStats();
      }, 3000);
    } catch (err: any) {
      setIsSpinning(false);
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col max-w-2xl mx-auto px-4 py-6 text-slate-900 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-slate-100"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Match & Win
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
              Slot machine
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full shadow-lg border-2 border-slate-800">
            <Coins className="h-4 w-4 text-amber-400" />
            <span className="font-black text-sm tracking-tight">Balance</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 mb-6 text-[10px] md:text-xs">
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-600 border-none font-bold py-1 px-3"
        >
          <Info className="h-3 w-3 mr-1" /> View Rules
        </Badge>
        <div className="flex items-center gap-4 text-slate-500 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Coins className="h-3 w-3 text-amber-500" />
            Cost:{" "}
            <span className="text-slate-900">
              {config?.costPerPlay || 25} TC
            </span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
            <Zap className="h-3 w-3 text-blue-500" />
            Left:{" "}
            <span
              className={cn(
                playsLeftToday <= 0 ? "text-red-500" : "text-slate-900",
              )}
            >
              {playsLeftToday} Plays
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="relative p-2 md:p-4 bg-slate-200/50 rounded-[32px] border-4 border-slate-100 shadow-2xl">
          <div className="flex gap-2 md:gap-4 relative z-10">
            <Reel
              isSpinning={isSpinning && !results[0]}
              finalSymbol={results[0]}
              symbols={allSymbols}
            />
            <Reel
              isSpinning={isSpinning && !results[1]}
              finalSymbol={results[1]}
              symbols={allSymbols}
            />
            <Reel
              isSpinning={isSpinning && !results[2]}
              finalSymbol={results[2]}
              symbols={allSymbols}
            />
          </div>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500/20 z-0" />
        </div>

        <div className="mt-8 text-center min-h-[60px]">
          <AnimatePresence mode="wait">
            {showResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                {isWin ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-green-600 font-extrabold text-xl md:text-2xl italic tracking-tighter uppercase">
                      Match!
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                      You won{" "}
                      <span className="text-slate-900 font-black">
                        {winningSymbol?.value} {winningSymbol?.type}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-slate-400 font-black text-xl italic tracking-tighter uppercase">
                      Better Luck Next Time
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
                Match 3 symbols to win rewards
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto pt-6 pb-2">
        <Button
          onClick={handlePlay}
          disabled={isSpinning || playsLeftToday <= 0}
          className={cn(
            "w-full h-16 md:h-20 rounded-3xl text-xl md:text-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-xl relative overflow-hidden",
            isSpinning
              ? "bg-slate-200 text-slate-400"
              : "bg-slate-900 text-white hover:bg-slate-800",
          )}
        >
          {isSpinning ? (
            <RefreshCw className="h-6 w-6 animate-spin" />
          ) : (
            <span>Play Now</span>
          )}
        </Button>
      </div>
    </div>
  );
}
