"use client";

import { useState } from "react";
import { Cake, Calendar, ArrowLeft, Users, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

// Sample data for birthdays
const birthdaysData = [
  {
    id: 1,
    name: "Alex Martinez",
    date: "2025-12-24",
    birthYear: 1990,
    department: "Engineering",
    avatar: "AM",
  },
  {
    id: 2,
    name: "Jessica Lee",
    date: "2025-12-30",
    birthYear: 1992,
    department: "Marketing",
    avatar: "JL",
  },
  {
    id: 3,
    name: "Chris Anderson",
    date: "2026-01-03",
    birthYear: 1988,
    department: "Product",
    avatar: "CA",
  },
  {
    id: 4,
    name: "Nina Patel",
    date: "2026-01-08",
    birthYear: 1995,
    department: "Design",
    avatar: "NP",
  },
  {
    id: 5,
    name: "Tom Wilson",
    date: "2026-01-15",
    birthYear: 1987,
    department: "Sales",
    avatar: "TW",
  },
  {
    id: 6,
    name: "Sophie Chen",
    date: "2025-12-18",
    birthYear: 1993,
    department: "HR",
    avatar: "SC",
  },
  {
    id: 7,
    name: "Daniel Brown",
    date: "2025-12-12",
    birthYear: 1991,
    department: "Finance",
    avatar: "DB",
  },
  {
    id: 8,
    name: "Emma Taylor",
    date: "2025-11-25",
    birthYear: 1994,
    department: "Operations",
    avatar: "ET",
  },
  {
    id: 9,
    name: "Ryan Garcia",
    date: "2025-11-18",
    birthYear: 1989,
    department: "Engineering",
    avatar: "RG",
  },
];

export default function BirthdaysPage() {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState("all");

  const today = new Date("2025-12-21"); // Using current date from metadata

  const upcomingBirthdays = birthdaysData
    .filter((birthday) => new Date(birthday.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastBirthdays = birthdaysData
    .filter((birthday) => new Date(birthday.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today 🎉";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`;
    return `In ${Math.floor(diffDays / 30)} months`;
  };

  const getAge = (birthYear: number) => {
    return 2025 - birthYear;
  };

  const gradients = [
    "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-amber-500 to-orange-500",
  ];

  const getGradient = (id: number) => {
    return gradients[id % gradients.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/celebrations")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Birthdays</h1>
                <p className="text-muted-foreground mt-1">
                  Make every birthday special
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Birthdays
            </CardTitle>
            <Cake className="h-4 w-4 text-pink-600 dark:text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              {upcomingBirthdays.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In the next 3 months
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <PartyPopper className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              2
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Weekly celebrations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              4
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              December birthdays
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {birthdaysData.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Birthdays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            Upcoming Birthdays
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingBirthdays.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBirthdays.map((birthday) => (
                <Card
                  key={birthday.id}
                  className="hover:shadow-lg transition-all border-2 border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-full bg-gradient-to-br ${getGradient(
                          birthday.id
                        )} text-white w-12 h-12 flex items-center justify-center font-bold text-lg`}
                      >
                        {birthday.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {birthday.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {birthday.department}
                        </p>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center gap-1 text-sm font-medium text-pink-600 dark:text-pink-400">
                            <Cake className="h-4 w-4" />
                            <span>Turning {getAge(birthday.birthYear)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(birthday.date)}</span>
                          </div>
                          <div className="text-xs font-medium text-primary">
                            {getDaysUntil(birthday.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No upcoming birthdays
            </p>
          )}
        </CardContent>
      </Card>

      {/* Past Birthdays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Past Birthdays
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pastBirthdays.length > 0 ? (
            <div className="space-y-3">
              {pastBirthdays.map((birthday) => (
                <div
                  key={birthday.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-full bg-gradient-to-br ${getGradient(
                        birthday.id
                      )} text-white w-10 h-10 flex items-center justify-center font-bold opacity-60`}
                    >
                      {birthday.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium">{birthday.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {birthday.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Cake className="h-4 w-4" />
                      <span>Turned {getAge(birthday.birthYear)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(birthday.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No past birthdays
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
