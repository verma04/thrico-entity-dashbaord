"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useGetJobById } from "@/graphql/actions/jobs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Eye,
  Calendar,
  Building2,
  Star,
  CheckCircle2,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

export default function JobManagePage() {
  const singularName = useModuleStore((state) => state.jobSingularName);
  const pathname = usePathname();
  const id = pathname?.split("/")[2];

  const { data, loading } = useGetJobById({
    variables: { id },
    skip: !id,
  });

  const job = data?.getJobById;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {singularName} not found.
      </div>
    );
  }

  const stats = [
    {
      label: "Applicants",
      value: job.numberOfApplicant ?? 0,
      icon: Users,
      gradient: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      label: "Views",
      value: job.numberOfViews ?? 0,
      icon: Eye,
      gradient: "from-violet-500/10 to-violet-600/5",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
    },
    {
      label: "Status",
      value: job.status,
      icon: CheckCircle2,
      gradient: "from-emerald-500/10 to-emerald-600/5",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      isText: true,
    },
    {
      label: "Verification",
      value: job.verification?.isVerified ? "Verified" : "Unverified",
      icon: Star,
      gradient: "from-amber-500/10 to-amber-600/5",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      isText: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden bg-gradient-to-br ${stat.gradient}`}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={`p-2.5 rounded-xl ${stat.iconBg} ring-1 ring-black/[0.04]`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p
                  className={`font-bold ${stat.isText ? "text-sm" : "text-2xl"} tracking-tight`}
                >
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Job Overview */}
      <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">
            {singularName} Overview
          </CardTitle>
          <CardDescription>Details about this {singularName.toLowerCase()} listing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              job.company?.name && {
                icon: Building2,
                label: "Company",
                value: job.company.name,
              },
              job.location?.name && {
                icon: MapPin,
                label: "Location",
                value: job.location.name,
              },
              job.jobType && {
                icon: Briefcase,
                label: `${singularName} Type`,
                value: job.jobType.replace("-", " "),
              },
              job.workplaceType && {
                icon: Clock,
                label: "Workplace",
                value: job.workplaceType,
              },
              job.salary && {
                icon: DollarSign,
                label: "Salary",
                value: job.salary,
              },
              job.experienceLevel && {
                icon: GraduationCap,
                label: "Experience",
                value: job.experienceLevel,
              },
              job.applicationDeadline && {
                icon: Calendar,
                label: "Deadline",
                value: new Date(job.applicationDeadline).toLocaleDateString(),
              },
            ]
              .filter(Boolean)
              .map((item: any) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate capitalize">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {job.description && (
            <>
              <Separator className="bg-border/40" />
              <div>
                <p className="text-sm font-semibold mb-3">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </div>
            </>
          )}

          {job.skills && job.skills.length > 0 && (
            <>
              <Separator className="bg-border/40" />
              <div>
                <p className="text-sm font-semibold mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-lg px-3 py-1 text-xs font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
