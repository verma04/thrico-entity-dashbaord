"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AppLoading() {
  const [phase, setPhase] = useState<"enter" | "pulse" | "progress">("enter");
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("pulse"), 700);
    const t2 = setTimeout(() => {
      setPhase("progress");
      animate(progress, 1, {
        duration: 1.9,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-black overflow-hidden select-none">

      {/* ── Subtle noise grain ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 300px",
        }}
      />

      {/* ── Logo ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.86 }}
        animate={
          phase === "enter"
            ? { opacity: 1, scale: 1 }
            : phase === "pulse"
              ? { opacity: 1, scale: [1, 1.04, 1] }
              : { opacity: 1, scale: 1 }
        }
        transition={
          phase === "enter"
            ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            : phase === "pulse"
              ? { duration: 0.75, ease: "easeInOut", times: [0, 0.5, 1] }
              : { duration: 0.3, ease: "easeOut" }
        }
        style={{ willChange: "transform, opacity" }}
      >
        {/* Squircle shadow */}
        <div
          className="relative"
          style={{
            filter:
              "drop-shadow(0 22px 48px rgba(0,0,0,0.14)) drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
          }}
        >
          {/* Icon */}
          <div
            className="relative overflow-hidden"
            style={{
              width: 116,
              height: 116,
              borderRadius: "26.66%", // Apple squircle
            }}
          >
            <Image
              src="/thrico_app_Icon.jpg"
              alt="Thrico"
              fill
              priority
              className="object-cover"
              sizes="116px"
            />
            {/* Apple-style specular gloss */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(155deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.06) 40%, transparent 65%)",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Bottom zone: progress + wordmark ── */}
      <motion.div
        className="absolute bottom-[9%] flex flex-col items-center gap-[14px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "progress" ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Thin progress track */}
        <div
          className="relative overflow-hidden rounded-full"
          style={{
            width: 196,
            height: 2.5,
            background: "oklch(0.88 0 0 / 60%)",
          }}
        >
          {/* Fill — light mode: near-black, dark mode: near-white */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-[oklch(0.15_0_0)] dark:bg-[oklch(0.92_0_0)]"
            style={{ width: progressWidth }}
          />
          {/* Shimmer at leading edge */}
          <motion.div
            aria-hidden
            className="absolute inset-y-0 rounded-full"
            style={{
              width: 32,
              left: progressWidth,
              x: "-60%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 50%, transparent)",
              filter: "blur(1.5px)",
            }}
          />
        </div>

        {/* Wordmark */}
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="text-[10.5px] font-semibold tracking-[0.25em] uppercase text-black/35 dark:text-white/30"
          style={{ fontFamily: "var(--font-avant-garde), sans-serif" }}
        >
          Thrico
        </motion.span>
      </motion.div>
    </div>
  );
}
