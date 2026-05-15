import React from "react";
import { Info } from "lucide-react";

interface GameHowItWorksProps {
  gameName: string;
  currencyName: string;
  paragraphs: React.ReactNode[];
}

export function GameHowItWorks({
  gameName,
  currencyName,
  paragraphs,
}: GameHowItWorksProps) {
  return (
    <div className="rounded-[24px] border border-border bg-card p-5 max-w-[340px] mx-auto shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
          <Info className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground leading-none">
            How It Works
          </h4>
          <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
            Game Mechanics
          </p>
        </div>
      </div>
      <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    </div>
  );
}
