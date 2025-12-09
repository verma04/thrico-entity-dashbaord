"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Download,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[1400px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">
                {selectedPoll.title}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {selectedPoll.question}
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{totalVotes}</span>
                    <span className="text-xs text-muted-foreground">
                      Total Votes
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">
                      {data?.getPollResult?.options?.length || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Options
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">
                      {moment(selectedPoll.createdAt).format("MMM DD, YYYY")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Created
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <Badge
                      variant={
                        selectedPoll.status === "APPROVED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedPoll.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground mt-1">
                      Status
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-4 p-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="p-6"
            >
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="overview" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="votes" className="gap-2">
                  <Users className="h-4 w-4" />
                  Individual Votes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <Summary
                  selectedPoll={selectedPoll}
                  options={data?.getPollResult.options}
                  totalVotes={totalVotes}
                />
              </TabsContent>

              <TabsContent value="votes" className="mt-6">
                <Votes {...data?.getPollResult} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
