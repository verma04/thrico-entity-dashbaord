"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trophy,
  Medal,
  Award,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock leaderboard data
const mockLeaderboard = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "SJ",
    points: 4520,
    badges: 15,
    rank: "Master",
    streak: 45,
    change: "up",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "MC",
    points: 3890,
    badges: 12,
    rank: "Expert",
    streak: 32,
    change: "up",
  },
  {
    id: 3,
    name: "Emily Williams",
    avatar: "EW",
    points: 3445,
    badges: 11,
    rank: "Expert",
    streak: 28,
    change: "same",
  },
  {
    id: 4,
    name: "David Kumar",
    avatar: "DK",
    points: 2980,
    badges: 9,
    rank: "Contributor",
    streak: 21,
    change: "down",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    avatar: "LA",
    points: 2750,
    badges: 8,
    rank: "Contributor",
    streak: 18,
    change: "up",
  },
  {
    id: 6,
    name: "James Wilson",
    avatar: "JW",
    points: 2340,
    badges: 7,
    rank: "Contributor",
    streak: 14,
    change: "same",
  },
  {
    id: 7,
    name: "Maria Garcia",
    avatar: "MG",
    points: 1890,
    badges: 6,
    rank: "Explorer",
    streak: 10,
    change: "up",
  },
  {
    id: 8,
    name: "Robert Taylor",
    avatar: "RT",
    points: 1650,
    badges: 5,
    rank: "Explorer",
    streak: 7,
    change: "down",
  },
  {
    id: 9,
    name: "Jennifer Lee",
    avatar: "JL",
    points: 1420,
    badges: 4,
    rank: "Explorer",
    streak: 5,
    change: "up",
  },
  {
    id: 10,
    name: "William Brown",
    avatar: "WB",
    points: 980,
    badges: 3,
    rank: "Rookie",
    streak: 3,
    change: "same",
  },
];

const getRankIcon = (position: number) => {
  if (position === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
  if (position === 2) return <Medal className="h-6 w-6 text-gray-400" />;
  if (position === 3) return <Award className="h-6 w-6 text-amber-600" />;
  return <span className="font-bold text-muted-foreground">#{position}</span>;
};

const getChangeIcon = (change: string) => {
  if (change === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (change === "down")
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
};

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("all-time");
  const [sortBy, setSortBy] = useState("points");

  const filteredUsers = mockLeaderboard.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredUsers.slice(0, 3);
  const rest = filteredUsers.slice(3);

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {/* 2nd Place */}
        <div className="pt-8">
          {topThree[1] && (
            <Card className="text-center border-gray-300 bg-gradient-to-b from-gray-50 to-white">
              <CardContent className="pt-6">
                <div className="relative inline-block mb-3">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold mx-auto">
                    {topThree[1].avatar}
                  </div>
                  <Medal className="h-6 w-6 text-gray-400 absolute -bottom-1 -right-1" />
                </div>
                <h3 className="font-semibold">{topThree[1].name}</h3>
                <p className="text-2xl font-bold text-gray-600">
                  {topThree[1].points.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">points</p>
                <Badge variant="secondary" className="mt-2">
                  {topThree[1].rank}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 1st Place */}
        <div>
          {topThree[0] && (
            <Card className="text-center border-yellow-300 bg-gradient-to-b from-yellow-50 to-white shadow-lg">
              <CardContent className="pt-6">
                <div className="relative inline-block mb-3">
                  <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-2xl font-bold mx-auto border-4 border-yellow-300">
                    {topThree[0].avatar}
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500 absolute -bottom-1 -right-1" />
                </div>
                <h3 className="font-bold text-lg">{topThree[0].name}</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {topThree[0].points.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">points</p>
                <Badge className="mt-2 bg-yellow-500">{topThree[0].rank}</Badge>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 3rd Place */}
        <div className="pt-12">
          {topThree[2] && (
            <Card className="text-center border-amber-300 bg-gradient-to-b from-amber-50 to-white">
              <CardContent className="pt-6">
                <div className="relative inline-block mb-3">
                  <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-lg font-bold mx-auto">
                    {topThree[2].avatar}
                  </div>
                  <Award className="h-5 w-5 text-amber-600 absolute -bottom-1 -right-1" />
                </div>
                <h3 className="font-semibold text-sm">{topThree[2].name}</h3>
                <p className="text-xl font-bold text-amber-600">
                  {topThree[2].points.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">points</p>
                <Badge
                  variant="outline"
                  className="mt-2 border-amber-400 text-amber-600"
                >
                  {topThree[2].rank}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="daily">Today</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="points">Points</SelectItem>
              <SelectItem value="badges">Badges</SelectItem>
              <SelectItem value="streak">Streak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead className="text-center">Badges</TableHead>
                <TableHead className="text-center">Streak</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={cn(index < 3 && "bg-muted/30")}
                >
                  <TableCell className="text-center">
                    {getRankIcon(index + 1)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                        {user.avatar}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-primary">
                    {user.points.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{user.badges}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="flex items-center justify-center gap-1">
                      🔥 {user.streak}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.rank}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getChangeIcon(user.change)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
