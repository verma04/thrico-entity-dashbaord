import React from "react";
import Link from "next/link";
import { Sparkles, ChevronRight, Gamepad2, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const RewardsBanner = () => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 md:p-8 shadow-xl shadow-indigo-500/20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnpNMzYgMjR2NmgxMnYtNkgzNnpNMjQgMzR2NmgxMnYtNkgyNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/8 blur-3xl transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
              Interactive Rewards
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight max-w-lg">
            Scratch Cards, Spin Wheels
            <br />
            <span className="text-white/70">&amp; Match-to-Win Games</span>
          </h2>
          <p className="text-white/55 text-sm leading-relaxed max-w-sm">
            Boost engagement by up to 3× with gamified rewards. Members love
            instant-reveal experiences.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <Link href="/gamification/rewards/coupons/create">
              <Button className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-5 rounded-full text-xs h-9 gap-2 shadow-lg shadow-indigo-900/30 group/btn">
                Get Started
                <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/gamification/rewards/analytics">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10 font-medium text-xs h-9 rounded-full px-4"
              >
                View analytics
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-end gap-3">
          {[
            {
              icon: Gamepad2,
              label: "Match",
              delay: "200ms",
              rotate: "-6deg",
              size: "h-20 w-20",
            },
            {
              icon: RotateCcw,
              label: "Spin",
              delay: "0ms",
              rotate: "0deg",
              size: "h-24 w-24 -translate-y-2",
            },
            {
              icon: Zap,
              label: "Scratch",
              delay: "100ms",
              rotate: "6deg",
              size: "h-20 w-20",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                rotate: item.rotate,
                transitionDelay: item.delay,
              }}
              className={cn(
                "rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center justify-center gap-2 group-hover:rotate-0 transition-all duration-500",
                item.size,
              )}
            >
              <item.icon className="h-7 w-7 text-white opacity-80" />
              <span className="text-[8px] font-bold text-white/50 tracking-widest uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
