"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Apple,
  CheckCircle2,
  ArrowRight,
  Palette,
  Rocket,
  Fingerprint,
  BellRing,
  BarChart3,
  RefreshCw,
  Blocks,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEntitySettings, useGetEntity } from "@/graphql/actions";
import { motion } from "framer-motion";
import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MobileAppLanding() {
  const { data } = useGetEntity();

  console.log(data);
  const entityName = data?.getEntity?.name || "Your Community";
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Inquiry submitted successfully!");
    setIsModalOpen(false);
  };

  const features = [
    {
      title: "Your Brand, Your Identity",
      description: `${entityName} gets its own app name, logo, colors, splash screen, icons, fonts, and custom branding across Android and iOS.`,
      icon: Palette,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      gradient: "from-pink-500/5",
    },
    {
      title: "Publish Everywhere",
      description:
        "Release directly to Google Play and the Apple App Store with automated build generation, code signing, and submission.",
      icon: Rocket,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      gradient: "from-blue-500/5",
    },
    {
      title: "White-Label Experience",
      description:
        "Provide a completely branded experience with your own domain, login screen, notifications, and app identity.",
      icon: Fingerprint,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      gradient: "from-purple-500/5",
    },
    {
      title: "Push Notifications",
      description:
        "Keep members engaged with announcements, events, reminders, chats, and personalized notifications.",
      icon: BellRing,
      color: "text-red-500",
      bg: "bg-red-500/10",
      gradient: "from-red-500/5",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Monitor downloads, active users, engagement, retention, and community growth from one dashboard.",
      icon: BarChart3,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      gradient: "from-indigo-500/5",
    },
    {
      title: "One-Click Updates",
      description:
        "Publish new app versions, branding changes, and feature updates without rebuilding your infrastructure.",
      icon: RefreshCw,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      gradient: "from-cyan-500/5",
    },
    {
      title: "Custom Modules",
      description:
        "Enable or disable features like Feed, Events, Groups, Marketplace, Donations, Jobs, Directory, Learning, and more.",
      icon: Blocks,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      gradient: "from-orange-500/5",
    },
  ];

  const half = Math.ceil(features.length / 2);
  const firstColumn = features.slice(0, half);
  const secondColumn = features.slice(half);

  return (
    <div className="relative min-h-[calc(100vh-2rem)] w-full overflow-hidden bg-background flex flex-col xl:flex-row items-center justify-center p-6 lg:p-12 gap-12 lg:gap-24">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Left Content Column */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl xl:max-w-xl space-y-8 text-center xl:text-left"
      >
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {entityName} <br />
            <span className="text-muted-foreground">Mobile App</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Transform {entityName} into a fully branded mobile experience.
            Launch your own community app with custom branding, native Android &
            iOS support, AI-powered engagement, push notifications, and seamless
            publishing through Thrico.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 pt-4 flex-wrap">
          <Button
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="h-14 px-8 text-base w-full sm:w-auto rounded-xl shadow-xl shadow-primary/20 group"
          >
            <Smartphone className="w-5 h-5 mr-2" />
            Build Android App
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="h-14 px-8 text-base w-full sm:w-auto rounded-xl bg-background hover:bg-muted/50 group"
          >
            <Apple className="w-5 h-5 mr-2" />
            Build iOS App
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Mobile App Inquiry</DialogTitle>
                <DialogDescription>
                  Interested in launching your own mobile app? Fill out the form below and our team will get in touch with you.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Platform Needed</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="android">Android Only</SelectItem>
                        <SelectItem value="ios">iOS Only</SelectItem>
                        <SelectItem value="both">Both Android & iOS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your requirements..."
                      className="resize-none"
                      rows={4}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-base">
                  Submit Inquiry
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-center xl:justify-start gap-6 pt-4 text-sm font-medium text-muted-foreground">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> No coding
            required
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> App Store &
            Google Play
          </span>
        </div>
      </motion.div>

      {/* Right Visual Column (Feature Cards) */}
      <div className="relative z-10 flex-1 w-full max-w-3xl xl:max-w-none h-[600px] overflow-hidden flex flex-row gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
        <Marquee vertical className="flex-1 [--duration:40s]" pauseOnHover>
          {firstColumn.map((feature, i) => (
            <div
              key={i}
              className="relative group bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden w-full"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  feature.gradient,
                )}
              />
              <div className="relative space-y-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    feature.bg,
                  )}
                >
                  <feature.icon className={cn("w-6 h-6", feature.color)} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>

        <Marquee
          vertical
          reverse
          className="flex-1 [--duration:40s] hidden md:flex"
          pauseOnHover
        >
          {secondColumn.map((feature, i) => (
            <div
              key={i}
              className="relative group bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden w-full"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  feature.gradient,
                )}
              />
              <div className="relative space-y-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    feature.bg,
                  )}
                >
                  <feature.icon className={cn("w-6 h-6", feature.color)} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
