"use client";

import {
  Info,
  ShieldAlert,
  Globe,
  CalendarDays,
  Hash,
  UserCircle,
  Lock,
  Unlock,
  Type,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function CommunityAbout() {
  return (
    <div className="p-4 sm:p-6 bg-background/50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/50 overflow-hidden bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="pb-8 pt-10 px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                About This Community
              </CardTitle>
            </div>
            <CardDescription className="text-base text-muted-foreground leading-relaxed max-w-2xl">
              Get to know the mission, rules, and core details that make this
              community a unique space for photographers.
            </CardDescription>
          </CardHeader>

          <Separator className="bg-border/50" />

          <CardContent className="p-8 space-y-12">
            {/* Description Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xl">
                <Type className="h-5 w-5 text-muted-foreground" />
                <h2>Core Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed pl-7 border-l-2 border-primary/20">
                A community for photographers of all levels to share their work,
                get feedback, and learn from each other. Whether you're just
                starting out or you're a seasoned professional, everyone is
                welcome here!
              </p>
            </section>

            {/* Rules Section */}
            <section className="space-y-6 bg-muted/30 p-6 rounded-2xl border border-border/50">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xl">
                <ShieldAlert className="h-5 w-5 text-orange-500" />
                <h2>Community Guidelines</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-1">
                {[
                  "Be respectful and constructive in your feedback",
                  "Only post your own original work",
                  "No spam or promotional content",
                  "Keep discussions photography-related",
                ].map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-background/50 p-3 rounded-xl border border-border/40 shadow-sm transition-all hover:border-primary/30"
                  >
                    <div className="mt-0.5 p-1 bg-primary/5 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground/80 leading-snug">
                      {rule}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Details Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xl">
                <Hash className="h-5 w-5 text-purple-500" />
                <h2>Quick Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pl-1">
                {[
                  {
                    label: "Privacy",
                    value: "Public",
                    icon: Unlock,
                    color: "text-green-600",
                    bg: "bg-green-50",
                  },
                  {
                    label: "Join Condition",
                    value: "Anyone can join",
                    icon: UserCircle,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Categories",
                    value: "Arts & Photography",
                    icon: Hash,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                  {
                    label: "Location",
                    value: "Global",
                    icon: Globe,
                    color: "text-sky-600",
                    bg: "bg-sky-50",
                  },
                  {
                    label: "Created",
                    value: "Jan 15, 2024",
                    icon: CalendarDays,
                    color: "text-slate-600",
                    bg: "bg-slate-50",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-4 rounded-2xl border border-border/60 hover:bg-muted/50 transition-colors group"
                  >
                    <div
                      className={`p-2 w-fit rounded-lg ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="font-semibold text-foreground">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
