"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroEventCountdownProps {
  content: Record<string, unknown>;
}

const HeroEventCountdown: React.FC<HeroEventCountdownProps> = ({ content }) => {
  const badge = (content.badge as string) || "Annual Tech & Leadership Summit 2026";
  const title = (content.title as string) || "Shape the Future of Connected Communities";
  const description =
    (content.description as string) ||
    "Join over 5,000 founders, creators, and engineers for 3 days of transformative keynotes, interactive workshops, and high-impact networking.";
  const eventDate = (content.eventDate as string) || "October 24-26, 2026";
  const eventLocation = (content.eventLocation as string) || "San Francisco, CA & Global Stream";

  // Real-time Countdown calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 14,
    minutes: 36,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0)
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const buttons = Array.isArray(content.buttons)
    ? (content.buttons as Array<{ text?: string; link?: string; variant?: string }>)
    : [
        { text: "Claim Early Bird Pass", link: "/register", variant: "primary" },
        { text: "View Schedule", link: "#agenda", variant: "outline" },
      ];

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 text-white py-20 md:py-32">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
        {/* Event Meta Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <span>⚡</span> {badge}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            <span>{eventDate}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs">
            <MapPin className="h-3.5 w-3.5 text-pink-400" />
            <span>{eventLocation}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
          {title}
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          {description}
        </p>

        {/* Live Countdown Counter Blocks */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto pt-2">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINUTES", value: timeLeft.minutes },
            { label: "SECONDS", value: timeLeft.seconds },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center shadow-lg"
            >
              <div className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-2">
          {buttons.map((btn, idx) => (
            <a
              key={idx}
              href={btn.link || "#"}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-xl",
                btn.variant === "outline"
                  ? "border border-white/20 bg-white/5 hover:bg-white/10 text-white"
                  : "bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white hover:scale-105"
              )}
            >
              <Ticket className="h-4 w-4" />
              <span>{btn.text || "Get Tickets"}</span>
            </a>
          ))}
        </div>

        {/* Attendee Avatar Social Proof */}
        <div className="flex items-center justify-center gap-3 pt-4 text-xs text-slate-400">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-slate-900 bg-gradient-to-br from-indigo-400 to-purple-500 shadow-xs flex items-center justify-center text-white text-[10px] font-bold"
              >
                {i}
              </div>
            ))}
          </div>
          <span>Joined by 3,200+ attendees from 48 countries</span>
        </div>
      </div>
    </div>
  );
};

export default HeroEventCountdown;
