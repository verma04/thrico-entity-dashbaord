"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Save, 
  RotateCcw, 
  Sparkles, 
  Info,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

/* ─── Module Card ───────────────────────────────────────────────────────── */
export const ModuleCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn(
    "border-zinc-200/60 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)] overflow-hidden rounded-[24px] bg-white transition-all duration-300",
    className
  )}>
    {children}
  </Card>
);

/* ─── Module Header ─────────────────────────────────────────────────────── */
interface ModuleHeaderProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  iconClassName?: string;
  hasChanged?: boolean;
  onSave?: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  saveLabel?: string;
  resetLabel?: string;
  children?: React.ReactNode;
}

export const ModuleHeader = ({
  title,
  description,
  icon,
  iconClassName = "bg-zinc-900",
  hasChanged,
  onSave,
  onReset,
  isLoading,
  saveLabel = "SAVE CONFIG",
  resetLabel = "DISCARD",
  children
}: ModuleHeaderProps) => (
  <CardHeader className="border-b border-zinc-100/80 px-8 py-6 bg-linear-to-br from-white via-white to-zinc-50/10">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className={cn(
          "w-12 h-12 rounded-[16px] flex items-center justify-center text-white shadow-xl shadow-zinc-200/50 shrink-0 border border-white/10 ring-8 ring-zinc-50/50",
          iconClassName
        )}>
          {icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-black tracking-tighter text-zinc-900 leading-tight">
              {title}
            </CardTitle>
            <div className="p-1 rounded-md bg-indigo-50 text-indigo-500">
              <Sparkles size={12} fill="currentColor" />
            </div>
          </div>
          {description && (
            <CardDescription className="text-[13px] font-semibold text-zinc-400/80 tracking-tight flex items-center gap-2">
              <Info size={14} className="opacity-70" />
              {description}
            </CardDescription>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {children}
        <AnimatePresence mode="wait">
          {hasChanged && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2"
            >
              {onReset && (
                <Button
                  variant="ghost"
                  onClick={onReset}
                  size="sm"
                  className="text-zinc-400 hover:text-zinc-600 h-9 px-3 rounded-xl gap-2 font-bold text-[11px] tracking-wider uppercase transition-colors"
                  disabled={isLoading}
                >
                  <RotateCcw size={13} />
                  {resetLabel}
                </Button>
              )}
              {onSave && (
                <Button
                  onClick={onSave}
                  disabled={isLoading}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 text-[13px] font-black transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] border-b-2 border-indigo-800"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <Save size={14} className="mr-2" strokeWidth={2.5} />
                  )}
                  {isLoading ? "UPDATING" : saveLabel}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </CardHeader>
);


/* ─── Module Status Bar ─────────────────────────────────────────────────── */
export const ModuleStatusBar = ({ label = "System Online" }: { label?: string }) => (
  <div className="bg-zinc-50/50 px-8 py-4 border-t border-zinc-100/80 flex items-center justify-between transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_oklch(0.69_0.17_162/0.4)] animate-pulse" />
      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">
        {label}
      </span>
    </div>
    <div className="text-[10px] font-bold text-zinc-300 italic tracking-tighter flex items-center gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
      Powered by Thrico Ecosystem
    </div>
  </div>
);

/* ─── Module Section Header ─────────────────────────────────────────────── */
export const ModuleSectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-5 pt-6 pb-3">
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-black text-indigo-600/60 uppercase tracking-[0.25em] whitespace-nowrap">
        {children}
      </span>
      <div className="h-px w-full bg-linear-to-r from-zinc-100 via-zinc-50/50 to-transparent" />
    </div>
  </div>
);

/* ─── Dirty Indicator ───────────────────────────────────────────────────── */
export const DirtyMarker = () => (
  <motion.span 
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_oklch(0.76_0.18_70/0.4)]" 
  />
);
