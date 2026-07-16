"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITY_BY_ID } from "@/graphql/quries/group/approval";
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
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";

export default function CommunityAbout() {
  const { id } = useParams() as { id: string };

  const { data, loading, error } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { input: { communityId: id } },
    skip: !id,
  });

  const community = data?.getCommunityById;

  if (loading) {
    return (
      <div className="p-4 sm:p-6 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="p-4 sm:p-6 min-h-screen flex items-center justify-center text-muted-foreground">
        Failed to load community details.
      </div>
    );
  }

  const rules = community.rules || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden bg-gradient-to-br from-card to-muted/10 rounded-2xl">
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
            community a unique space.
          </CardDescription>
        </CardHeader>

        <Separator className="bg-border/40" />

        <CardContent className="p-8 space-y-12">
          {/* Description Section */}
          {community.description && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xl">
                <Type className="h-5 w-5 text-muted-foreground" />
                <h2>Core Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed pl-7 border-l-2 border-primary/20">
                {community.description}
              </p>
            </section>
          )}

          {/* Rules Section */}
          {rules.length > 0 && (
            <section className="space-y-6 bg-muted/20 p-6 rounded-2xl border border-border/40">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xl">
                <ShieldAlert className="h-5 w-5 text-orange-500" />
                <h2>Community Guidelines</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-1">
                {rules.map((rule: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border/40 shadow-sm transition-all hover:border-primary/30"
                  >
                    <div className="mt-0.5 p-1 bg-primary/10 rounded-full flex-shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-foreground/90 leading-snug">
                        {rule.title}
                      </span>
                      <span className="text-xs font-medium text-foreground/70 leading-snug">
                        {rule.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

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
                  value:
                    community.privacy === "PUBLIC" ? "Public" : "Private",
                  icon: community.privacy === "PUBLIC" ? Unlock : Lock,
                  color: "text-green-600",
                  bg: "bg-green-500/10",
                },
                {
                  label: "Join Condition",
                  value: community.joiningTerms === "OPEN" ? "Anyone can join" : "Invite Only",
                  icon: UserCircle,
                  color: "text-blue-600",
                  bg: "bg-blue-500/10",
                },
                {
                  label: "Categories",
                  value:
                    community.categories && community.categories.length > 0
                      ? community.categories.join(", ")
                      : "General",
                  icon: Hash,
                  color: "text-purple-600",
                  bg: "bg-purple-500/10",
                },
                {
                  label: "Location",
                  value: community.location || "Global",
                  icon: community.location ? MapPin : Globe,
                  color: "text-sky-600",
                  bg: "bg-sky-500/10",
                },
                {
                  label: "Created",
                  value: moment(Number(community.createdAt)).format("MMM DD, YYYY"),
                  icon: CalendarDays,
                  color: "text-slate-600",
                  bg: "bg-slate-500/10",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 p-5 rounded-2xl border border-border/40 hover:bg-muted/30 transition-colors group"
                >
                  <div
                    className={`p-2.5 w-fit rounded-xl ${item.bg} ${item.color} ring-1 ring-black/[0.04] group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="font-semibold text-sm text-foreground mt-0.5">
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
  );
}
