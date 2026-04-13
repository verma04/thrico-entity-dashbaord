"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetEntity } from "@/graphql/actions";
import { Loader2, RefreshCw } from "lucide-react";

interface SwitchingLoaderProps {
  isVisible: boolean;
  targetWorkspaceName?: string;
}

export function SwitchingLoader({
  isVisible,
  targetWorkspaceName,
}: SwitchingLoaderProps) {
  const { data: currentEntityData } = useGetEntity();
  const currentEntity = currentEntityData?.getEntity;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/20 dark:bg-background/40 backdrop-blur-md"
          />

          {/* Centered Modal Loader */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-[400px] bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-[0_20px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.4)] border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center gap-8 overflow-hidden"
          >
            {/* Logo Section */}
            <div className="relative group">
              <div className="size-20 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center p-3 relative z-10 shadow-sm">
                {currentEntity?.logo ? (
                  <img
                    src={`https://cdn.thrico.network/${currentEntity.logo}`}
                    alt="Current"
                    className="size-full object-contain filter grayscale opacity-80"
                  />
                ) : (
                  <div className="size-8 rounded bg-zinc-200 dark:bg-zinc-700" />
                )}

                {/* Subtle spinner over current logo */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <RefreshCw className="size-6 text-primary animate-spin" />
                </div>
              </div>

              {/* Orbital pulse */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl -z-10"
              />
            </div>

            {/* Text Segment */}
            <div className="flex flex-col items-center text-center gap-2">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                Authenticating Context
              </h3>
              <p className="text-sm text-zinc-500 font-medium max-w-[200px]">
                Securely switching your session to{" "}
                <span className="text-primary font-bold">
                  {targetWorkspaceName || "another account"}
                </span>
                ...
              </p>
            </div>

            {/* Simple Progress Bar */}
            <div className="w-full max-w-[200px] h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full w-1/3 bg-primary rounded-full"
              />
            </div>

            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest pt-2">
              <Loader2 className="size-3 animate-spin" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
