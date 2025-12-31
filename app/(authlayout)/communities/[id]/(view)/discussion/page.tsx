"use client";

import {
  Star,
  Users,
  Trophy,
  TrendingUp,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  Shield,
  MessageCircle,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CommunityDashboard() {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-background/50 min-h-screen animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* Main Content Area - Can be expanded for discussion feed later */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/10 p-8 shadow-sm">
            <div className="flex flex-col gap-4">
              <Badge
                variant="outline"
                className="w-fit bg-primary/5 text-primary border-primary/20"
              >
                Community Hub
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome to the Discussion
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                Connect with passionate photographers, share your latest work,
                and get constructive feedback from the community.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  <MessageCircle className="h-4 w-4" />
                  Start a Discussion
                </Button>
                <Button variant="outline" className="gap-2">
                  View Guidelines
                </Button>
              </div>
            </div>
          </div>

          {/* This area is where the discussion feed would normally go */}
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-muted rounded-2xl bg-muted/20">
            <div className="p-4 bg-muted rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No discussions yet</h2>
            <p className="text-muted-foreground text-center max-w-sm px-6">
              Be the first to start a conversation in this community and connect
              with others.
            </p>
          </div>
        </div>

        {/* Sidebar Statistics and Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/50 overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">Community Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm group">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Total Posts
                </span>
                <span className="font-bold tabular-nums">1,234</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                  Posts Today
                </span>
                <span className="font-bold text-green-600 tabular-nums">
                  12
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <UserPlus className="h-3.5 w-3.5 text-blue-500" />
                  New Members
                </span>
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100"
                >
                  +23 this week
                </Badge>
              </div>
              <div className="pt-2 border-t border-dashed">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                    Community Rating
                  </span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>4.8</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/50 bg-gradient-to-br from-card to-muted/20">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    4.6
                  </span>
                  <div className="mt-2">{renderStars(4.6)}</div>
                  <span className="text-xs text-muted-foreground mt-1 font-medium">
                    (156 verified ratings)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary hover:bg-primary/5 font-semibold -mr-2"
                >
                  Rate Community
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/50">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-foreground">
                  Community Admins
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-3 group">
                <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border/50">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground leading-none mb-1">
                    John Doe
                  </span>
                  <Badge
                    variant="outline"
                    className="w-fit text-[10px] h-5 px-1.5 uppercase tracking-wider bg-orange-50 text-orange-700 border-orange-200"
                  >
                    Administrator
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border/50">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground leading-none mb-1">
                    Jane Smith
                  </span>
                  <Badge
                    variant="outline"
                    className="w-fit text-[10px] h-5 px-1.5 uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Co-Admin
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/50">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Suggested Hubs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {[
                { name: "Street Photography", members: "8.5K", rating: 4.7 },
                { name: "Portrait Masters", members: "12.1K", rating: 4.9 },
                { name: "Nature Photography", members: "15.3K", rating: 4.6 },
              ].map((hub, i) => (
                <div
                  key={hub.name}
                  className="flex justify-between items-center group transition-all"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground leading-tight group-hover:text-primary transition-colors cursor-pointer">
                      {hub.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <span>{hub.members} members</span>
                      <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                      <div className="flex items-center gap-1">
                        <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                        <span>{hub.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-full hover:bg-primary hover:text-white transition-all"
                  >
                    Join
                  </Button>
                </div>
              ))}
              <Button
                variant="link"
                className="w-full text-xs text-muted-foreground hover:text-primary h-auto pt-2 group"
              >
                Explore All Communities
                <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
