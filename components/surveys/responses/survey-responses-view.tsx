"use client";

import React, { useState, useMemo } from "react";
import {
  useGetSurveyResponses,
  useGetSurvey,
  SurveyResponse,
} from "@/graphql/surveys/survey-queries";
import { useExportSurveyResponses } from "@/graphql/surveys/survey-mutations";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableItem,
  AdminTableText,
  AdminTableMetric,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Mail,
  Calendar,
  MessageSquare,
  Download,
  Loader2,
  Phone,
  User,
  HelpCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SurveyResponsesViewProps {
  surveyId: string;
}

export const SurveyResponsesView: React.FC<SurveyResponsesViewProps> = ({
  surveyId,
}) => {
  const [selectedResponse, setSelectedResponse] =
    useState<SurveyResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const { data: surveyData } = useGetSurvey({
    variables: { getSurveyId: surveyId },
    skip: !surveyId,
  });

  const {
    data: responsesData,
    loading,
    error,
  } = useGetSurveyResponses({
    variables: {
      surveyId,
      input: { limit: 100, offset: 0 },
    },
  });

  const rawResponses = responsesData?.getSurveyResponses?.responses || [];
  const survey = surveyData?.getSurvey;

  const [exportResponses, { loading: exporting }] = useExportSurveyResponses({
    onCompleted: (res) => {
      const result = res?.exportSurveyResponses;
      if (result?.fileUrl) {
        const link = document.createElement("a");
        link.href = result.fileUrl;
        link.setAttribute("download", `survey-responses-${surveyId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(result.message || "Survey responses exported successfully!");
      } else {
        toast.success(result?.message || "Export initiated. You will receive an email shortly.");
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to export survey responses");
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

  // Filter and sort responses
  const filteredResponses = useMemo(() => {
    let list = [...rawResponses];

    // Search filter
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        const name = `${r.respondent?.firstName || ""} ${r.respondent?.lastName || ""} ${r.name || ""}`.toLowerCase();
        const email = `${r.respondent?.email || ""} ${r.email || ""}`.toLowerCase();
        const id = r.id.toLowerCase();
        return name.includes(term) || email.includes(term) || id.includes(term);
      });
    }

    // Type filter
    if (typeFilter !== "ALL") {
      list = list.filter((r) => {
        const type = r.respondentType || (r.respondent?.id ? "USER" : r.name || r.email ? "GUEST" : "ANONYMOUS");
        return type.toUpperCase() === typeFilter.toUpperCase();
      });
    }

    // Sort order
    list.sort((a, b) => {
      const dateA = new Date(a.submittedAt).getTime();
      const dateB = new Date(b.submittedAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [rawResponses, searchQuery, typeFilter, sortOrder]);

  // AdminTable columns configuration
  const columns: AdminTableColumn<SurveyResponse>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-12 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => index + 1,
    },
    {
      key: "respondent",
      header: "Respondent",
      cell: (row) => {
        const respondent = row.respondent;
        const isRegistered = Boolean(respondent?.id);
        const displayName = isRegistered
          ? `${respondent?.firstName || ""} ${respondent?.lastName || ""}`.trim() || "Member"
          : row.name || "Anonymous Respondent";

        const subtitle = isRegistered
          ? respondent?.about?.headline || respondent?.email || "Community Member"
          : row.email
            ? row.email
            : `ID: ${row.respondentId?.slice(0, 8) || row.id?.slice(0, 8)}...`;

        const fallback = isRegistered
          ? `${respondent?.firstName?.charAt(0) || ""}${respondent?.lastName?.charAt(0) || ""}` || "M"
          : row.name
            ? row.name.charAt(0).toUpperCase()
            : "A";

        const itemContent = (
          <AdminTableItem
            avatar={respondent?.avatar}
            shape="circle"
            title={displayName}
            subtitle={subtitle}
            fallbackText={fallback}
            onClick={() => setSelectedResponse(row)}
          />
        );

        if (isRegistered && respondent) {
          return (
            <UserProfileHoverCard user={respondent}>
              <div>{itemContent}</div>
            </UserProfileHoverCard>
          );
        }

        return itemContent;
      },
    },
    {
      key: "contact",
      header: "Contact",
      cell: (row) => {
        const email = row.respondent?.email || row.email || "—";
        const phone = row.phone;
        return (
          <AdminTableText
            primary={email}
            secondary={phone}
            icon={Mail}
          />
        );
      },
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => {
        const type = row.respondentType || (row.respondent?.id ? "USER" : row.name || row.email ? "GUEST" : "ANONYMOUS");
        const statusMap: Record<string, { label: string; status: "active" | "pending" | "inactive" }> = {
          USER: { label: "Member", status: "active" },
          GUEST: { label: "Guest", status: "pending" },
          ANONYMOUS: { label: "Anonymous", status: "inactive" },
        };
        const config = statusMap[type] || { label: type, status: "inactive" };
        return <AdminStatusBadge status={config.status}>{config.label}</AdminStatusBadge>;
      },
    },
    {
      key: "answersCount",
      header: "Answers",
      cell: (row) => {
        const count = Object.keys(row.answers || {}).length;
        return (
          <AdminTableMetric
            value={count}
            unit="Questions"
            icon={HelpCircle}
            variant="mono"
          />
        );
      },
    },
    {
      key: "submittedAt",
      header: "Submitted",
      cell: (row) => (
        <AdminTableDate
          date={row.submittedAt}
          icon={true}
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
            setSelectedResponse(row);
          }}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Answers</span>
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 border border-dashed border-border rounded-xl bg-card p-12">
        <div className="p-4 rounded-full bg-destructive/10">
          <MessageSquare className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-destructive font-medium text-sm">
          Failed to load survey responses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Action Bar (Identical to members/all design pattern) */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <EcosystemActionBar shadow="none" className="border-b-0">
          <EcosystemActionBar.Group align="left">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by respondent name, email, or ID..."
              className="w-[280px]"
            />

            {/* Respondent Type Filter */}
            <EcosystemActionBar.Item>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-background text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                  <SelectItem value="ALL" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    All Types
                  </SelectItem>
                  <SelectItem value="USER" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Registered Members
                  </SelectItem>
                  <SelectItem value="GUEST" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Guest Submissions
                  </SelectItem>
                  <SelectItem value="ANONYMOUS" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Anonymous
                  </SelectItem>
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>

            {/* Sort Order */}
            <EcosystemActionBar.Item>
              <Select
                value={sortOrder}
                onValueChange={(val: "newest" | "oldest") => setSortOrder(val)}
              >
                <SelectTrigger className="w-[125px] h-8 rounded-md border-border bg-background text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[130px]">
                  <SelectItem value="newest" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Newest First
                  </SelectItem>
                  <SelectItem value="oldest" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Oldest First
                  </SelectItem>
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
            {/* Total Submissions Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 text-xs font-medium text-muted-foreground">
              <span>Total:</span>
              <span className="font-semibold text-foreground">{rawResponses.length}</span>
            </div>

            {/* Export CSV Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 gap-1.5 border-border rounded-md text-xs font-medium cursor-pointer shadow-2xs hover:bg-accent transition-colors"
              onClick={handleExport}
              disabled={exporting || rawResponses.length === 0}
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

      {/* Admin Table */}
      <AdminTable<SurveyResponse>
        columns={columns}
        data={filteredResponses}
        loading={loading}
        keyExtractor={(r) => r.id}
        emptyIcon={MessageSquare}
        emptyTitle="No survey responses found"
        emptyDescription="No submissions match your search or filter criteria."
        pageSize={15}
        enableColumnToggle={true}
        size="md"
      />

      {/* Response Detail Drawer */}
      <Sheet
        open={!!selectedResponse}
        onOpenChange={(open) => !open && setSelectedResponse(null)}
      >
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto p-0 border-l border-border shadow-2xl">
          <SheetHeader className="px-8 pt-8 pb-6 bg-gradient-to-br from-primary/5 to-transparent border-b sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-4 mb-3">
              <Avatar className="h-12 w-12 ring-2 ring-background shadow-md">
                <AvatarImage
                  src={
                    selectedResponse?.respondent?.avatar
                      ? selectedResponse.respondent.avatar.startsWith("http")
                        ? selectedResponse.respondent.avatar
                        : `https://cdn.thrico.network/${selectedResponse.respondent.avatar}`
                      : ""
                  }
                />
                <AvatarFallback className="bg-primary/10 text-primary text-base font-bold">
                  {selectedResponse?.respondent?.firstName?.[0] ||
                    selectedResponse?.name?.[0] ||
                    "?"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <SheetTitle className="text-xl font-bold">
                  {selectedResponse?.respondent?.firstName
                    ? `${selectedResponse.respondent.firstName} ${selectedResponse.respondent.lastName || ""}`
                    : selectedResponse?.name || "Anonymous Submission"}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Submitted on{" "}
                  {selectedResponse?.submittedAt
                    ? format(new Date(selectedResponse.submittedAt), "PPP · p")
                    : "—"}
                </SheetDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-mono text-[10px]"
              >
                ID: {selectedResponse?.id?.slice(0, 12)}
              </Badge>
              {selectedResponse?.email && (
                <Badge variant="outline" className="text-[10px] font-normal">
                  {selectedResponse.email}
                </Badge>
              )}
            </div>
          </SheetHeader>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground flex items-center gap-2">
                Question Responses
                <div className="h-px flex-1 bg-border" />
              </h3>

              <div className="space-y-3">
                {selectedResponse &&
                  Object.entries(selectedResponse.answers || {}).map(
                    ([questionId, answer]: [string, any], idx) => {
                      const questionField =
                        survey?.form?.questions?.find(
                          (f: any) => f.id === questionId,
                        ) ||
                        survey?.fields?.find((f: any) => f.id === questionId);

                      return (
                        <Card
                          key={idx}
                          className="border border-border/80 bg-card shadow-2xs overflow-hidden"
                        >
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                              <span>
                                {questionField?.question ||
                                  `Question #${idx + 1}`}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[9px] h-4 px-1.5 rounded font-mono border-border capitalize"
                              >
                                {questionField?.type
                                  ?.toLowerCase()
                                  .replace(/_/g, " ") || "Input"}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-1">
                            <div className="text-sm font-medium leading-relaxed text-foreground">
                              {Array.isArray(answer) ? (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {answer.map((a, i) => (
                                    <Badge
                                      key={i}
                                      variant="secondary"
                                      className="rounded-md px-2 py-0.5 text-xs font-medium"
                                    >
                                      {a}
                                    </Badge>
                                  ))}
                                </div>
                              ) : typeof answer === "string" ? (
                                answer
                              ) : (
                                JSON.stringify(answer)
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    },
                  )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
