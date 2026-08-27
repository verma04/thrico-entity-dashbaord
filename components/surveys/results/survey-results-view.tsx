"use client";

import React, { useState, useMemo } from "react";
import {
  useGetSurveyResults,
  QuestionResult,
} from "@/graphql/surveys/survey-queries";
import { useExportSurveyResponses } from "@/graphql/surveys/survey-mutations";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableItem,
  AdminTableText,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  MessageSquare,
  BarChart3,
  Download,
  Loader2,
  List as ListIcon,
  LayoutGrid,
  HelpCircle,
  TrendingUp,
  Star,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SurveyResultsViewProps {
  surveyId: string;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export const SurveyResultsView: React.FC<SurveyResultsViewProps> = ({
  surveyId,
}) => {
  const [view, setView] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionResult | null>(null);

  const { data, loading, error } = useGetSurveyResults({
    variables: { surveyId },
  });

  const results = data?.getSurveyResults;
  const questionResults = results?.questionResults || [];

  const [exportResponses, { loading: exporting }] = useExportSurveyResponses({
    onCompleted: (res) => {
      const result = res?.exportSurveyResponses;
      if (result?.fileUrl) {
        const link = document.createElement("a");
        link.href = result.fileUrl;
        link.setAttribute("download", `survey-results-${surveyId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(result.message || "Survey results exported successfully!");
      } else {
        toast.success(result?.message || "Export initiated. You will receive an email shortly.");
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to export survey results");
    },
  });

  const handleExport = () => {
    exportResponses({
      variables: {
        surveyId,
        format: "csv",
      },
    });
  };

  // Filter questions
  const filteredQuestions = useMemo(() => {
    let list = [...questionResults];

    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      list = list.filter(
        (q) =>
          q.question.toLowerCase().includes(term) ||
          q.questionId.toLowerCase().includes(term),
      );
    }

    if (typeFilter !== "ALL") {
      list = list.filter((q) => q.type.toUpperCase() === typeFilter.toUpperCase());
    }

    return list;
  }, [questionResults, searchQuery, typeFilter]);

  // Helper for top choice / insight
  const getTopInsight = (q: QuestionResult) => {
    if (q.choices && q.choices.length > 0) {
      if (q.type === "RATING" || q.type === "SCALE") {
        const avg =
          q.choices.reduce((acc, c) => acc + parseFloat(c.label || "0") * c.count, 0) /
          (q.totalAnswers || 1);
        return `Avg: ${avg.toFixed(1)} / 5`;
      }
      const top = [...q.choices].sort((a, b) => b.count - a.count)[0];
      if (top && top.count > 0) {
        return `${top.label} (${top.percentage}%)`;
      }
    }
    if (q.answers && q.answers.length > 0) {
      return `${q.answers.length} text entries`;
    }
    return "No responses yet";
  };

  // Table Columns definition matching members/all
  const columns: AdminTableColumn<QuestionResult>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-12 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => index + 1,
    },
    {
      key: "question",
      header: "Question",
      cell: (row) => (
        <AdminTableItem
          icon={HelpCircle}
          shape="square"
          title={row.question || "Untitled Question"}
          subtitle={`ID: ${row.questionId.slice(0, 8)}...`}
          onClick={() => setSelectedQuestion(row)}
        />
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => {
        const statusMap: Record<string, "active" | "pending" | "inactive"> = {
          MULTIPLE_CHOICE: "active",
          SINGLE_CHOICE: "active",
          DROPDOWN: "active",
          RATING: "pending",
          OPINION_SCALE: "pending",
          SHORT_TEXT: "inactive",
          LONG_TEXT: "inactive",
        };
        const status = statusMap[row.type] || "inactive";
        const formattedLabel = row.type.replace(/_/g, " ").toLowerCase();
        return (
          <AdminStatusBadge status={status} className="capitalize">
            {formattedLabel}
          </AdminStatusBadge>
        );
      },
    },
    {
      key: "totalAnswers",
      header: "Responses",
      cell: (row) => (
        <AdminTableMetric
          value={row.totalAnswers}
          unit="Answers"
          icon={MessageSquare}
          variant="mono"
        />
      ),
    },
    {
      key: "topInsight",
      header: "Top Insight / Average",
      cell: (row) => (
        <AdminTableText
          primary={getTopInsight(row)}
          icon={TrendingUp}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      isFixedRight: true,
      headerClassName: "w-28 text-right pr-4",
      className: "text-right pr-4",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2.5 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 gap-1.5 cursor-pointer rounded-md transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedQuestion(row);
          }}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Breakdown</span>
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 border border-dashed border-border rounded-xl bg-card p-12">
        <div className="p-4 rounded-full bg-destructive/10">
          <BarChart3 className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-destructive font-medium text-sm">
          Failed to load survey analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Action Bar (Matching members/all pattern) */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <EcosystemActionBar shadow="none" className="border-b-0">
          <EcosystemActionBar.Group align="left">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search question text or ID..."
              className="w-[280px]"
            />

            {/* Question Type Filter */}
            <EcosystemActionBar.Item>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px] h-8 rounded-md border-border bg-background text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="All Question Types" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
                  <SelectItem value="ALL" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    All Question Types
                  </SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="RATING" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Rating / Scale
                  </SelectItem>
                  <SelectItem value="SHORT_TEXT" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Short Text
                  </SelectItem>
                  <SelectItem value="LONG_TEXT" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Long Text
                  </SelectItem>
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
            {/* View Mode Toggle (Table / Grid) */}
            <EcosystemActionBar.ViewToggle
              value={view}
              onChange={(v) => setView(v as "list" | "grid")}
              options={[
                { id: "list", label: "Table", icon: ListIcon },
                { id: "grid", label: "Charts", icon: LayoutGrid },
              ]}
            />

            <EcosystemActionBar.Separator />

            {/* Total Submissions Count */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 text-xs font-medium text-muted-foreground">
              <span>Responses:</span>
              <span className="font-semibold text-foreground">
                {results?.totalResponses ?? 0}
              </span>
            </div>

            {/* Export CSV Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 gap-1.5 border-border rounded-md text-xs font-medium cursor-pointer shadow-2xs hover:bg-accent transition-colors"
              onClick={handleExport}
              disabled={exporting || !results?.totalResponses}
            >
              {exporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              ) : (
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span>{exporting ? "Exporting..." : "Export CSV"}</span>
            </Button>
          </EcosystemActionBar.Group>
        </EcosystemActionBar>
      </div>

      {/* Main Content Area */}
      {view === "list" ? (
        /* Admin Table View */
        <AdminTable<QuestionResult>
          columns={columns}
          data={filteredQuestions}
          loading={loading}
          keyExtractor={(q) => q.questionId}
          emptyIcon={BarChart3}
          emptyTitle="No question results found"
          emptyDescription="No question analytics match your search or filter criteria."
          pageSize={15}
          enableColumnToggle={true}
          size="md"
        />
      ) : (
        /* Charts Grid View */
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[360px] w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-card rounded-xl border border-dashed border-border text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-sm font-semibold">No questions found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search query or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuestions.map((question, index) => (
              <motion.div
                key={question.questionId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full border border-border shadow-xs hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                    <div className="space-y-1 pr-4">
                      <Badge
                        variant="outline"
                        className="mb-1 font-mono text-[9px] tracking-wider uppercase"
                      >
                        {question.type.replace(/_/g, " ")}
                      </Badge>
                      <CardTitle className="text-base font-semibold leading-tight">
                        {question.question}
                      </CardTitle>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted">
                        {question.totalAnswers} Answers
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-2">
                    {question.type === "MULTIPLE_CHOICE" ||
                    question.type === "SINGLE_CHOICE" ||
                    question.type === "DROPDOWN" ? (
                      <div className="h-[260px] w-full mt-2">
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
                                tick={{ fontSize: 11, fill: "#6b7280" }}
                              />
                              <Tooltip
                                contentStyle={{
                                  borderRadius: "8px",
                                  border: "1px solid #e5e7eb",
                                  fontSize: "12px",
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
                          <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
                            No response data available
                          </div>
                        )}
                      </div>
                    ) : question.type === "RATING" ||
                      question.type === "SCALE" ||
                      question.type === "OPINION_SCALE" ? (
                      <div className="h-[260px] w-full mt-2 flex flex-col justify-center items-center">
                        <div className="text-4xl font-black text-primary mb-1">
                          {(
                            (question.choices || []).reduce(
                              (acc, c) => acc + parseFloat(c.label || "0") * c.count,
                              0,
                            ) / (question.totalAnswers || 1)
                          ).toFixed(1)}
                          <span className="text-base text-muted-foreground font-normal">
                            {" "}
                            / 5
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
                          Average Rating
                        </p>

                        <div className="w-full space-y-2 px-4">
                          {question.choices
                            ?.slice()
                            .sort((a, b) => b.label.localeCompare(a.label))
                            .map((choice, i) => (
                              <div key={i} className="flex items-center gap-2.5">
                                <span className="text-xs font-mono w-4">
                                  {choice.label}★
                                </span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary/70 rounded-full"
                                    style={{ width: `${choice.percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs font-mono w-8 text-right text-muted-foreground">
                                  {choice.count}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Recent Text Entries
                        </div>
                        {question.answers && question.answers.length > 0 ? (
                          <div className="space-y-2">
                            {question.answers.slice(0, 4).map((answer, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-lg bg-muted/40 text-xs leading-relaxed border border-border/50"
                              >
                                {answer || (
                                  <span className="text-muted-foreground italic">
                                    Empty response
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 border border-dashed rounded-xl flex items-center justify-center text-muted-foreground text-xs italic">
                            No text entries submitted yet
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Question Breakdown Drawer */}
      <Sheet
        open={!!selectedQuestion}
        onOpenChange={(open) => !open && setSelectedQuestion(null)}
      >
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto p-0 border-l border-border shadow-2xl">
          <SheetHeader className="px-8 pt-8 pb-6 bg-gradient-to-br from-primary/5 to-transparent border-b sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="font-mono text-[10px] uppercase">
                {selectedQuestion?.type?.replace(/_/g, " ")}
              </Badge>
              <Badge variant="secondary" className="font-semibold text-[10px]">
                {selectedQuestion?.totalAnswers ?? 0} Responses
              </Badge>
            </div>
            <SheetTitle className="text-xl font-bold leading-snug">
              {selectedQuestion?.question}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Question ID: {selectedQuestion?.questionId}
            </SheetDescription>
          </SheetHeader>

          <div className="p-6 space-y-6">
            {selectedQuestion?.choices && selectedQuestion.choices.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  Choice Breakdown
                  <div className="h-px flex-1 bg-border" />
                </h4>

                <div className="space-y-3">
                  {selectedQuestion.choices.map((choice, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-border/80 bg-card shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{choice.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-foreground">
                            {choice.count}
                          </span>
                          <span className="text-muted-foreground font-normal">
                            ({choice.percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${choice.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedQuestion?.answers && selectedQuestion.answers.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  All Submitted Answers ({selectedQuestion.answers.length})
                  <div className="h-px flex-1 bg-border" />
                </h4>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {selectedQuestion.answers.map((ans, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-border/60 bg-muted/20 text-xs leading-relaxed"
                    >
                      {typeof ans === "string" ? ans : JSON.stringify(ans)}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
