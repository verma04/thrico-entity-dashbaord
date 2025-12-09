"use client";

import { Separator } from "@/components/ui/separator";

export default function AppLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f2f5] to-[#e6f7ff]">
      <div className="flex flex-col items-center gap-6">
        {/* Custom SVG Animation */}
        <div className="mb-6">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Animated boxes */}
            <g>
              {/* Box 1 - Blue */}
              <rect
                x="45"
                y="45"
                width="12"
                height="12"
                rx="3"
                fill="#0027ff"
                style={{
                  animation: "antdBounce 1.5s ease-in-out infinite",
                  animationDelay: "0ms",
                }}
              />
              {/* Box 2 - Pink */}
              <rect
                x="63"
                y="45"
                width="12"
                height="12"
                rx="3"
                fill="#ff5c6d"
                style={{
                  animation: "antdBounce 1.5s ease-in-out infinite",
                  animationDelay: "200ms",
                }}
              />
              {/* Box 3 - Pink */}
              <rect
                x="45"
                y="63"
                width="12"
                height="12"
                rx="3"
                fill="#ff5c6d"
                style={{
                  animation: "antdBounce 1.5s ease-in-out infinite",
                  animationDelay: "400ms",
                }}
              />
              {/* Box 4 - Blue */}
              <rect
                x="63"
                y="63"
                width="12"
                height="12"
                rx="3"
                fill="#0027ff"
                style={{
                  animation: "antdBounce 1.5s ease-in-out infinite",
                  animationDelay: "600ms",
                }}
              />
            </g>
            {/* Gradient definition */}
            <defs>
              <linearGradient
                id="antdGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#0027ff" />
                <stop offset="50%" stopColor="#ff5c6d" />
                <stop offset="100%" stopColor="#0027ff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <Separator />
        <span className="text-lg font-semibold text-muted-foreground">
          Loading...
        </span>
      </div>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes antdBounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}
