"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  Compass,
  Search,
  Sparkles,
  Layers,
  HelpCircle,
  ShieldAlert,
  MoveRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function NotFound() {
  const router = useRouter();

  const quickLinks = [
    {
      title: "Dashboard Home",
      desc: "Overview, analytics & quick actions",
      href: "/",
      icon: Home,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Community Feed",
      desc: "Posts, moderation & interactions",
      href: "/feed",
      icon: Layers,
      color: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Members & Growth",
      desc: "Manage entity directory & roles",
      href: "/members",
      icon: Compass,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Help & Support",
      desc: "Knowledge base & contact support",
      href: "/support",
      icon: HelpCircle,
      color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-primary/15 via-purple-500/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-blue-500/10 via-teal-500/10 to-transparent blur-[100px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Header bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/40 backdrop-blur-md bg-background/60 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform duration-200">
            T
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">Thrico</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">
              Entity Dashboard
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="hidden sm:inline-flex gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16 max-w-4xl mx-auto w-full text-center relative z-10">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 backdrop-blur-sm text-xs font-medium text-muted-foreground mb-6 shadow-2xs">
          <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* Big Glitch/Gradient Number Display */}
        <div className="relative mb-6 select-none">
          <h1 className="text-8xl sm:text-9xl md:text-[140px] font-black tracking-tighter leading-none bg-gradient-to-b from-foreground via-foreground/80 to-foreground/20 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center -z-10 blur-3xl opacity-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        </div>

        {/* Title & Description */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-3">
          Looks like this destination went off the grid
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          The page or entity resource you are looking for might have been moved,
          deleted, or is temporarily unavailable in your workspace.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Button asChild size="lg" className="rounded-xl px-5 shadow-sm">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="rounded-xl px-5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Page
          </Button>
        </div>

        {/* Suggested Destinations Card Grid */}
        <div className="w-full max-w-2xl text-left border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Helpful Destinations
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Quick Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3 p-3 rounded-xl border border-border/40 hover:border-primary/40 bg-background/50 hover:bg-accent/40 transition-all duration-150"
                >
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shrink-0 mt-0.5`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </span>
                      <MoveRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground/80 border-t border-border/40 bg-background/40">
        <p>© {new Date().getFullYear()} Thrico Entity Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}
