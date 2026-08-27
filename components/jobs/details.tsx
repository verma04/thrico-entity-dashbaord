"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  Globe,
  DollarSign,
  Users,
  Eye,
  Calendar,
  CheckCircle,
  ThumbsDown,
  Undo,
  Shield,
  XCircle,
  Star,
  CheckCircle2,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import React, { useState } from "react";
import moment from "moment";
import { Job } from "../../graphql/actions/jobs";
import { useModuleStore } from "@/store/useModuleStore";

const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    { variant: any; icon: any; className: string }
  > = {
    APPROVED: {
      variant: "outline",
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    PENDING: {
      variant: "outline",
      icon: <Clock className="w-3.5 h-3.5 mr-1" />,
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    REJECTED: {
      variant: "outline",
      icon: <XCircle className="w-3.5 h-3.5 mr-1" />,
      className: "border-rose-200 bg-rose-50 text-rose-700",
    },
    DISABLED: {
      variant: "outline",
      icon: <XCircle className="w-3.5 h-3.5 mr-1" />,
      className: "border-border bg-muted/50 text-foreground",
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Badge
      variant={config.variant}
      className={`font-medium px-2.5 py-0.5 ${config.className}`}
    >
      {config.icon}
      {status}
    </Badge>
  );
};

const getVerificationBadge = (isVerified: boolean) => {
  return isVerified ? (
    <Badge
      variant="outline"
      className="border-blue-200 bg-blue-50 text-blue-700 font-medium px-2.5 py-0.5"
    >
      <Shield className="w-3.5 h-3.5 mr-1" />
      Verified
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="border-border bg-muted/50 text-muted-foreground font-medium px-2.5 py-0.5"
    >
      <Shield className="w-3.5 h-3.5 mr-1 opacity-50" />
      Unverified
    </Badge>
  );
};

const getEligibilityBadge = (eligibility?: string | null) => {
  const norm = eligibility?.toUpperCase() || "ALL";
  const config: Record<
    string,
    { label: string; icon: any; className: string }
  > = {
    ALL: {
      label: "All Members",
      icon: <Users className="w-3.5 h-3.5 mr-1" />,
      className: "border-border bg-muted/50 text-foreground",
    },
    VERIFIED: {
      label: "Verified Members Only",
      icon: <Shield className="w-3.5 h-3.5 mr-1" />,
      className:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
    },
    TIERS: {
      label: "Specific Tiers",
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
      className:
        "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300",
    },
    SPECIFIC_CUSTOMERS: {
      label: "Specific Members",
      icon: <Users className="w-3.5 h-3.5 mr-1" />,
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
    },
  };

  const cfg = config[norm] || config.ALL;
  return (
    <Badge
      variant="outline"
      className={`font-medium px-2.5 py-0.5 ${cfg.className}`}
    >
      {cfg.icon}
      {cfg.label}
    </Badge>
  );
};

const MetricItem = ({ icon: Icon, value, label, colorClass }: any) => (
  <div className="flex flex-col p-4 bg-muted/30 border border-border/50 rounded-2xl transition-all hover:bg-muted/50">
    <div className="flex items-center gap-2 mb-2">
      <div className={`p-2 rounded-xl ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
    <span className="text-2xl font-bold tracking-tight text-foreground">
      {value}
    </span>
  </div>
);

const Details = ({
  job,
  isDrawerOpen,
  setIsDrawerOpen,
  handleAction,
}: {
  job: Job | null;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  handleAction: (
    action:
      | "APPROVE"
      | "DISABLE"
      | "ENABLE"
      | "UNBLOCK"
      | "REJECT"
      | "FLAG"
      | "VERIFY"
      | "UNVERIFY"
      | "REAPPROVE",
    listing: Job | null,
  ) => void;
}) => {
  const singularName = useModuleStore((state) => state.jobSingularName);
  const [activeTab, setActiveTab] = useState("description");

  if (!job) return null;

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-0 border-l shadow-2xl">
        <div className="relative">
          {/* Header Cover Background */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-primary/10 via-background to-muted border-b border-border/50 overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, #000 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            ></div>
          </div>

          <div className="relative pt-24 px-8 pb-8">
            <SheetHeader className="mb-6">
              <SheetTitle className="sr-only">
                {singularName} Details
              </SheetTitle>
              <div className="flex items-end gap-6">
                <Avatar className="h-24 w-24 rounded-2xl border-4 border-background shadow-xl bg-background">
                  <AvatarImage
                    src={`https://cdn.thrico.network/${job.company?.logo}`}
                    alt={job.company?.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold rounded-2xl">
                    {job.company?.name?.charAt(0) || "J"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(job.status)}
                      {getVerificationBadge(
                        job.verification?.isVerified || false,
                      )}
                      {getEligibilityBadge(
                        job.memberEligibility ||
                          job.eligibility?.memberEligibility ||
                          job.eligibilityRule?.memberEligibility,
                      )}
                    </div>
                  </div>
                  <p className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {job.company?.name || "Unknown Company"}
                  </p>
                </div>
              </div>
            </SheetHeader>

            {/* Tags / Metadata */}
            <div className="flex flex-wrap items-center gap-4 py-4 mb-6 border-y border-border/40">
              {job.location && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  <span>
                    {typeof job.location === "object"
                      ? job.location?.name
                      : job.location}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4 text-primary/70" />
                <span className="capitalize">
                  {job.jobType?.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Globe className="h-4 w-4 text-primary/70" />
                <span className="capitalize">{job.workplaceType}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-primary/70" />
                  <span>{job.salary}</span>
                </div>
              )}
              {job.experienceLevel && (
                <Badge
                  variant="secondary"
                  className="ml-auto rounded-md font-semibold tracking-wide"
                >
                  {job.experienceLevel.replace(/-/g, " ")}
                </Badge>
              )}
            </div>

            {/* High-Level Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <MetricItem
                icon={Users}
                value={job.numberOfApplicant || 0}
                label="Applications"
                colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              />
              <MetricItem
                icon={Eye}
                value={job.numberOfViews || 0}
                label="Views"
                colorClass="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              />
              <MetricItem
                icon={Calendar}
                value={moment(job.createdAt).fromNow(true)}
                label="Listed"
                colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              />
            </div>

            {/* Tabs Content */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 space-x-6">
                {[
                  "description",
                  "requirements",
                  "responsibilities",
                  "benefits",
                ].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-1 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="py-6 min-h-[300px]">
                <TabsContent
                  value="description"
                  className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {job.description || "No description provided."}
                    </p>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-secondary/50 hover:bg-secondary border border-border/50 text-secondary-foreground text-sm font-medium rounded-lg transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent
                  value="requirements"
                  className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <ul className="space-y-4">
                    {job.requirements && job.requirements.length > 0 ? (
                      job.requirements.map((item: string, index: number) => (
                        <li
                          key={index}
                          className="flex gap-4 p-4 rounded-xl bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors"
                        >
                          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-foreground/90 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">
                        No specific requirements listed.
                      </p>
                    )}
                  </ul>
                </TabsContent>

                <TabsContent
                  value="responsibilities"
                  className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <ul className="space-y-4">
                    {job.responsibilities && job.responsibilities.length > 0 ? (
                      job.responsibilities.map(
                        (item: string, index: number) => (
                          <li
                            key={index}
                            className="flex gap-4 p-4 rounded-xl bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors"
                          >
                            <ChevronRight className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                            <span className="text-foreground/90 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ),
                      )
                    ) : (
                      <p className="text-muted-foreground italic">
                        No responsibilities listed.
                      </p>
                    )}
                  </ul>
                </TabsContent>

                <TabsContent
                  value="benefits"
                  className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.benefits && job.benefits.length > 0 ? (
                      job.benefits.map((item: string, index: number) => (
                        <li
                          key={index}
                          className="flex gap-3 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
                        >
                          <Star className="h-5 w-5 text-amber-500 shrink-0" />
                          <span className="text-foreground/90 font-medium">
                            {item}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">
                        No benefits listed.
                      </p>
                    )}
                  </ul>
                </TabsContent>
              </div>
            </Tabs>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 -mx-8 px-8 py-6 bg-background/80 backdrop-blur-xl border-t flex justify-end gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
              {job?.status === "PENDING" && (
                <>
                  <Button
                    variant="outline"
                    className="border-rose-200 hover:bg-rose-50 hover:text-rose-700 text-rose-600 transition-colors"
                    onClick={() => handleAction("REJECT", job)}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
                    onClick={() => handleAction("APPROVE", job)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve {singularName}
                  </Button>
                </>
              )}

              {job?.status === "REJECTED" && (
                <Button
                  variant="secondary"
                  onClick={() => handleAction("REAPPROVE", job)}
                >
                  <Undo className="mr-2 h-4 w-4" />
                  Re-approve
                </Button>
              )}

              {job?.status === "APPROVED" && (
                <>
                  <Button
                    variant="outline"
                    className="border-border hover:bg-muted/50 transition-colors"
                    onClick={() => handleAction("DISABLE", job)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Disable
                  </Button>
                  {job?.verification?.isVerified ? (
                    <Button
                      variant="outline"
                      className="border-rose-200 hover:bg-rose-50 hover:text-rose-700 text-rose-600 transition-colors"
                      onClick={() => handleAction("UNVERIFY", job)}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Remove Verification
                    </Button>
                  ) : (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none"
                      onClick={() => handleAction("VERIFY", job)}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Verify {singularName}
                    </Button>
                  )}
                </>
              )}

              {job?.status === "DISABLED" && (
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
                  onClick={() => handleAction("ENABLE", job)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Enable {singularName}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Details;
