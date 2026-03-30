"use client";

import { motion } from "framer-motion";

export default function AppLoading() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-pink-500/10 blur-[150px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 max-w-md w-full px-6">
        {/* Glassmorphic Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-24 h-24 flex items-center justify-center rounded-3xl bg-white/5 dark:bg-black/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden group"
        >
          {/* Internal rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-transparent border-t-blue-500 border-r-purple-500 rounded-full scale-90"
          />
          
          {/* Center Logo/Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <span className="text-white font-black text-xl italic tracking-tighter">T</span>
          </motion.div>

          {/* Shimmer effect inside the box */}
          <motion.div
            animate={{
              x: [-100, 200],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.5,
            }}
            className="absolute inset-y-0 w-12 bg-white/20 -skew-x-12 blur-md"
          />
        </motion.div>

        {/* Text and Progress */}
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col items-center gap-2">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              thrico
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm font-medium text-muted-foreground/80 tracking-widest uppercase"
            >
              Preparing your experience
            </motion.p>
          </div>

          {/* Premium Progress Bar */}
          <div className="relative w-48 h-1 bg-muted/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500/80 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
            
            {/* Subtle base filling */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            />
          </div>

          {/* Bouncing Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full bg-blue-500"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating particles for depth */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 - 50 + "%", 
            y: Math.random() * 100 - 50 + "%",
            opacity: 0 
          }}
          animate={{ 
            y: ["0%", "-20%", "0%"],
            opacity: [0, 0.4, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-blue-400 rounded-full blur-[1px] pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 text-[10px] font-medium text-muted-foreground/40 uppercase tracking-[0.2em]"
      >
        Secure environment • Thrico Network
      </motion.div>
    </div>
  );
}
