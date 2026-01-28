"use client";

import React from "react";
import { useGetSurveyResults } from "@/graphql/surveys/survey-queries";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SurveyResultsViewProps {
  surveyId: string;
}

const COLORS = [
  "#8b5cf6",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export const SurveyResultsView: React.FC<SurveyResultsViewProps> = ({
  surveyId,
}) => {
  const router = useRouter();
  const { data, loading, error } = useGetSurveyResults({
    variables: { surveyId },
  });

  const results = data?.getSurveyResults;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive font-medium">
          Failed to load survey results.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="pl-0 gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Surveys
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Survey Results</h1>
          {loading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <p className="text-muted-foreground">
              Detailed breakdown of responses for this survey
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Card className="border-none bg-primary/5 shadow-none">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Responses
                </p>
                <p className="text-2xl font-bold">
                  {loading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    (results?.totalResponses ?? 0)
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results?.questionResults.map((question, index) => (
            <motion.div
              key={question.questionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1 pr-4">
                    <Badge
                      variant="outline"
                      className="mb-2 font-mono text-[10px] tracking-wider uppercase"
                    >
                      {question.type.replace(/_/g, " ")}
                    </Badge>
                    <CardTitle className="text-lg font-semibold leading-tight">
                      {question.question}
                    </CardTitle>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      Answers
                    </p>
                    <p className="text-lg font-bold">{question.totalAnswers}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  {question.type === "MULTIPLE_CHOICE" ||
                  question.type === "SINGLE_CHOICE" ||
                  question.type === "DROPDOWN" ? (
                    <div className="h-[300px] w-full mt-4">
                      {question.choices && question.choices.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={question.choices}
                            layout="vertical"
                            margin={{ left: 0, right: 30 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              horizontal={false}
                              stroke="#e5e7eb"
                            />
                            <XAxis type="number" hide />
                            <YAxis
                              dataKey="label"
                              type="category"
                              axisLine={false}
                              tickLine={false}
                              width={120}
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                            />
                            <Tooltip
                              cursor={{ fill: "rgba(0,0,0,0.02)" }}
                              contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                              {question.choices.map((_, i) => (
                                <Cell
                                  key={`cell-${i}`}
                                  fill={COLORS[i % COLORS.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
                          No choice data available
                        </div>
                      )}
                    </div>
                  ) : question.type === "RATING" ||
                    question.type === "SCALE" ? (
                    <div className="h-[300px] w-full mt-4 flex flex-col justify-center items-center">
                      {/* Simplified visualization for rating/scale - could be more complex later */}
                      <div className="text-5xl font-bold text-primary mb-2">
                        {(question.choices || []).reduce(
                          (acc, c) => acc + parseFloat(c.label) * c.count,
                          0,
                        ) / (question.totalAnswers || 1)}
                        <span className="text-lg text-muted-foreground font-medium">
                          / 5
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 font-medium uppercase tracking-wide">
                        Average Score
                      </p>

                      <div className="w-full space-y-2">
                        {question.choices
                          ?.sort((a, b) => b.label.localeCompare(a.label))
                          .map((choice, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-xs font-mono w-4">
                                {choice.label}
                              </span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary/60 rounded-full"
                                  style={{ width: `${choice.percentage}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono w-8 text-right">
                                {choice.count}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                        <MessageSquare className="h-4 w-4" />
                        Recent Responses
                      </div>
                      {question.answers && question.answers.length > 0 ? (
                        <div className="space-y-2">
                          {question.answers.slice(0, 5).map((answer, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-accent/30 text-sm leading-relaxed"
                            >
                              {answer || (
                                <span className="text-muted-foreground italic">
                                  Empty response
                                </span>
                              )}
                            </div>
                          ))}
                          {question.answers.length > 5 && (
                            <Button
                              variant="link"
                              className="w-full text-xs text-muted-foreground"
                            >
                              View all {question.answers.length} responses
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground">
                          <p className="text-sm italic">
                            No text responses yet
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && results?.questionResults.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 bg-accent/10 rounded-3xl border-2 border-dashed border-accent">
          <BarChart3 className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            No analytics available yet
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Once you receive responses for your survey, detailed charts and data
            breakdown will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
