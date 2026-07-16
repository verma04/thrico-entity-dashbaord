"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function PaymentLoading() {
  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-background/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center p-12 text-center rounded-3xl bg-card/5 border border-white/10 shadow-2xl overflow-hidden relative"
      >
        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 blur-[80px] -z-10" />
        
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 text-blue-500" />
          </motion.div>
          
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-16 h-16 bg-blue-400 blur-xl opacity-30"
          />
        </div>

        <div className="relative z-10">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground mt-8 mb-4 tracking-tight"
          >
            Verifying Your Payment
          </motion.h2>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground m-0 max-w-[280px] leading-relaxed"
          >
            Please wait while we secure your transaction with Thrico Network
          </motion.p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 rounded-full bg-blue-500"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
