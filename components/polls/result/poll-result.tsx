"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Download,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle2,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import moment from "moment";

import Summary from "./poll-summary";
import { getPollResult } from "../../../graphql/actions/polls";
import { poll } from "../ts-types";
import { Votes } from "./poll-votes";

export default function PollResultsPage({
  open,
  onClose,
  selectedPoll,
}: {
  open: boolean;
  onClose: () => void;
  selectedPoll: poll;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const { data, loading } = getPollResult({
    variables: {
      input: {
        pollId: selectedPoll?.id,
      },
    },
  });

  const totalVotes =
    data?.getPollResult?.options?.reduce(
      (acc: number, option: any) => acc + (option.votes || 0),
      0
    ) || 0;

  const handleExport = () => {
    // Export functionality here
    const csvContent = [
      ["Poll Results Export"],
      ["Title", selectedPoll.title],
      ["Question", selectedPoll.question],
      ["Total Votes", totalVotes.toString()],
      ["Created", moment(selectedPoll.createdAt).format("YYYY-MM-DD HH:mm")],
      [],
      ["Option", "Votes", "Percentage"],
      ...(data?.getPollResult?.options?.map((option: any) => [
        option.text,
        option.votes.toString(),
        `${((option.votes / totalVotes) * 100).toFixed(2)}%`,
      ]) || []),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `poll-results-${selectedPoll.id}-${moment().format(
      "YYYY-MM-DD"
    )}.csv`;
    a.click();
  };

  const topOption = data?.getPollResult?.options?.reduce((prev: any, current: any) =>
    (prev.votes > current.votes) ? prev : current
  , {votes: -1});

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] h-[90vh] overflow-hidden flex flex-col p-0 gap-0 border-none rounded-2xl">
        <div className="grid grid-cols-1 xl:grid-cols-3 flex-1 overflow-hidden min-h-0">
          
          {/* Left Column: Analytics & Data (2/3) */}
          <div className="xl:col-span-2 flex flex-col bg-background border-r border-border min-h-0">
            <div className="p-6 md:p-8 flex-1 overflow-y-auto min-h-0 space-y-8 custom-scrollbar">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-2">
                    <PieChart className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Poll Analysis</span>
                  </div>
                  <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                    {selectedPoll.title}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {selectedPoll.question}
                  </DialogDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport} className="shrink-0 group">
                  <Download className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                  Export CSV
                </Button>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="border-border/50 shadow-sm">
                  <CardContent className="p-4 flex flex-col justify-center h-full space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Total Votes</span>
                    </div>
                    <span className="text-2xl font-bold font-mono text-foreground">{totalVotes}</span>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                  <CardContent className="p-4 flex flex-col justify-center h-full space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Options</span>
                    </div>
                    <span className="text-2xl font-bold font-mono text-foreground">
                      {data?.getPollResult?.options?.length || 0}
                    </span>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                  <CardContent className="p-4 flex flex-col justify-center h-full space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Created</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {moment(selectedPoll.createdAt).format("MMM DD, YYYY")}
                    </span>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                  <CardContent className="p-4 flex flex-col justify-center h-full space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Status</span>
                    </div>
                    <div>
                      <Badge variant={selectedPoll.status === "APPROVED" ? "default" : "secondary"}>
                        {selectedPoll.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs for Deep Dive */}
              <div className="flex-1">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                  </div>
                ) : (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                    <TabsList className="h-8 bg-muted/40 border border-border rounded-lg p-0.5 gap-0.5">
                      <TabsTrigger 
                        value="overview" 
                        className="h-7 px-4 rounded-md text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all duration-200"
                      >
                        <BarChart3 className="h-3 w-3" />
                        Visual Overview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="votes" 
                        className="h-7 px-4 rounded-md text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all duration-200"
                      >
                        <Users className="h-3 w-3" />
                        Individual Votes
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="m-0 focus-visible:outline-none">
                      <Summary
                        selectedPoll={selectedPoll}
                        options={data?.getPollResult.options}
                        totalVotes={totalVotes}
                      />
                    </TabsContent>

                    <TabsContent value="votes" className="m-0 focus-visible:outline-none">
                      <Votes {...data?.getPollResult} />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Preview (1/3) */}
          <div className="hidden xl:flex flex-col bg-slate-50/50 dark:bg-zinc-950/50 p-8 relative overflow-y-auto items-center">
            <div className="mb-6 self-start w-full">
              <h4 className="text-sm font-bold text-foreground">Vibe Check</h4>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">End-User Experience</p>
            </div>

            <div className="relative group w-full max-w-[320px]">
              {/* Glowing ambient shadow */}
              <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-[40px] blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Mock Phone Frame */}
              <div className="relative flex flex-col w-full bg-white dark:bg-zinc-900 rounded-[36px] shadow-2xl border-4 border-zinc-200/50 dark:border-zinc-800 overflow-hidden text-zinc-900 dark:text-zinc-100 min-h-[500px]">
                
                {/* Mock Header */}
                <div className="pt-10 px-6 pb-4 bg-indigo-600 dark:bg-indigo-900 text-white space-y-3">
                  <div className="inline-flex items-center gap-1 opacity-80 mb-2">
                    <PieChart className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Community Poll</span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug">
                    {selectedPoll.question}
                  </h3>
                  <p className="text-xs text-indigo-100/70">
                    {totalVotes} members voted
                  </p>
                </div>

                {/* Mock Results Area */}
                <div className="p-5 space-y-4 flex-1 bg-zinc-50 dark:bg-black/40">
                  {data?.getPollResult?.options?.map((opt: any, i: number) => {
                    const percent = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                    const isTop = topOption?.id === opt.id && totalVotes > 0;
                    
                    return (
                      <div key={opt.id} className="relative">
                        <div className={cn(
                          "relative z-10 flex items-center justify-between p-3 rounded-xl border border-zinc-200 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden",
                          isTop && "border-indigo-500 ring-1 ring-indigo-500 shadow-indigo-500/20"
                        )}>
                          {/* Progress fill visual */}
                          <div 
                            className={cn(
                              "absolute inset-y-0 left-0 bg-indigo-50 dark:bg-indigo-500/10 transition-all duration-1000 ease-out",
                              isTop && "bg-indigo-100 dark:bg-indigo-500/20"
                            )}
                            style={{ width: `${percent}%` }}
                          />
                          
                          <div className="relative z-10 flex items-center gap-3">
                            <div className={cn(
                              "h-5 w-5 rounded-full border flex items-center justify-center shrink-0",
                              isTop ? "border-indigo-500 bg-indigo-500 text-white" : "border-zinc-300"
                            )}>
                              {isTop && <CheckCircle2 className="h-3 w-3" />}
                            </div>
                            <span className={cn(
                              "text-sm font-medium",
                              isTop && "font-bold text-indigo-700 dark:text-indigo-400"
                            )}>{opt.text}</span>
                          </div>
                          
                          <div className="relative z-10 flex flex-col items-end">
                            <span className={cn(
                              "text-sm font-bold",
                              isTop && "text-indigo-700 dark:text-indigo-400"
                            )}>{percent.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mock Bottom App Bar Area */}
                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
                  <div className="h-1.5 w-1/3 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-muted-foreground mt-6 max-w-[280px] text-center">
              This preview simulates how community members interact with the poll after voting.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
