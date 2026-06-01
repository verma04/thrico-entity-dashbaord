"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AppLoading() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary gradient glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-blue-400/30 blur-[100px] dark:bg-blue-500/20"
        />

        {/* Secondary gradient glow */}
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-slate-400/20 blur-[100px] dark:bg-slate-500/10"
        />

        {/* Subtle accent glow */}
        <motion.div
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 dark:from-slate-200/5 dark:via-transparent dark:to-slate-200/5"
        />
      </div>

      {/* Main Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-16 max-w-md w-full px-6"
      >
        {/* Premium Apple-style Icon Container */}
        <motion.div variants={itemVariants} className="relative">
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-32 h-32"
          >
            {/* Outer glow ring */}
            <motion.div
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-blue-400/30 via-slate-200/10 to-blue-400/30 dark:from-blue-500/20 dark:to-blue-400/10 blur-2xl"
            />

            {/* Main container with premium glass effect */}
            <div className="absolute inset-0 rounded-[40px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-slate-700/60 shadow-2xl overflow-hidden">
              {/* Inner shine effect */}
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none" />

              {/* Smooth rotating light border */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 dark:from-blue-500/0 dark:via-blue-500/20 dark:to-blue-500/0"
                style={{
                  boxShadow: "inset 0 0 60px rgba(59, 130, 246, 0.1)",
                }}
              />

              {/* Center Logo */}
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                  <Image
                    src="/thrico_app_Icon.jpg"
                    alt="Thrico"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress Indicators */}
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Minimalist Progress Indicator */}
          <motion.div variants={itemVariants} className="w-full max-w-xs">
            <div className="relative h-1.5 bg-gradient-to-r from-slate-200/30 to-slate-300/30 dark:from-slate-700/30 dark:to-slate-600/30 rounded-full overflow-hidden backdrop-blur-sm">
              {/* Animated progress fill */}
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent dark:via-blue-400 shadow-lg shadow-blue-400/40"
              />
            </div>
          </motion.div>

          {/* Subtle Loading Dots */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [0.8, 1, 0.8],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="w-1 h-1 rounded-full bg-blue-400/70 dark:bg-blue-500"
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Ambient Particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={
            {
              // x: Math.random() * window?.innerWidth - window?.innerWidth / 2,
              // y: Math.random() * window?.innerHeight,
              // opacity: 0,
            }
          }
          animate={{
            y: [null, Math.random() * 100 - 50],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
          className="absolute w-0.5 h-0.5 bg-blue-400/40 dark:bg-blue-500/30 rounded-full blur-sm pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Subtle Footer Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 text-xs font-medium text-muted-foreground/40 dark:text-slate-500/40 uppercase tracking-widest"
      >
        Thrico Network
      </motion.div>
    </div>
  );
}
