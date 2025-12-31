"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function WelcomeCelebration() {
  const searchParams = useSearchParams();

  const triggerConfetti = (intensity?: string) => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    // Adjust particle count based on intensity
    const particleCount = intensity === "high" ? 4 : 2;

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  useEffect(() => {
    // Check for first-time login parameter
    const isFirstLogin = searchParams.get("firstLogin") === "true";
    const intensity = searchParams.get("intensity");

    if (isFirstLogin) {
      triggerConfetti(intensity);
    }
  }, [searchParams]);

  return null;
}
