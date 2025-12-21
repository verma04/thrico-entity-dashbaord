"use client";

import { useRouter } from "next/navigation";
import { Cake, Gift, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CelebrationsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-8 w-8 text-amber-500" />
              <h1 className="text-3xl font-bold tracking-tight">Celebrations</h1>
              <Sparkles className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-muted-foreground mt-2">
              Celebrate special moments with your team
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Anniversaries Card */}
        <Card 
          className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-purple-500/50"
          onClick={() => router.push("/celebrations/anniversaries")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Work Anniversaries</CardTitle>
              <div className="rounded-full p-3 bg-purple-50 dark:bg-purple-950 group-hover:scale-110 transition-transform">
                <Gift className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Celebrate team members' milestones and years of dedication
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="font-medium">Upcoming & Past Events</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/celebrations/anniversaries");
              }}
            >
              View Anniversaries
            </Button>
          </CardContent>
        </Card>

        {/* Birthdays Card */}
        <Card 
          className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-pink-500/50"
          onClick={() => router.push("/celebrations/birthdays")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Birthdays</CardTitle>
              <div className="rounded-full p-3 bg-pink-50 dark:bg-pink-950 group-hover:scale-110 transition-transform">
                <Cake className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Never miss a birthday - make every team member feel special
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                <span className="font-medium">Upcoming & Past Events</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/celebrations/birthdays");
              }}
            >
              View Birthdays
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              Upcoming celebrations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total celebrations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              5+ year anniversaries
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
