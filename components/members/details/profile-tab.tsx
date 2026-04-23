"use client";

import React from "react";
import { 
  User as UserIcon, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  MapIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EmptyContentSection } from "./detail-states";

export function ProfileTab({ member }: { member: any }) {
  const user = member?.user;
  if (!user) return null;

  return (
    <div className="space-y-8 mt-0 border-none p-0 outline-none">
      {/* About Section */}
      {(user.about?.about || user.about?.headline) && (
        <section className="space-y-3">
          <h3 className="text-xl font-black flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" /> About
          </h3>
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {user.about?.about || user.about?.headline}
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Industries Section */}
      {member.industries && member.industries.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" /> Industries
          </h3>
          <div className="flex flex-wrap gap-2">
            {member.industries.map((industry: any) => (
              <Badge 
                key={industry.id} 
                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider"
              >
                {industry.title}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-black flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" /> Professional Experience
        </h3>
        <div className="space-y-4">
          {user.profile?.experience && user.profile.experience.length > 0 ? (
            user.profile.experience.map((exp: any, idx: number) => (
              <Card
                key={idx}
                className="border-border/40 group hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border/50">
                      {exp.company?.logo ? (
                        <img
                          src={exp.company.logo}
                          alt=""
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <Briefcase className="h-6 w-6 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-lg">{exp.title}</h4>
                      <p className="text-sm font-bold text-muted-foreground">
                        {exp.company?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground/70">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {exp.startDate} —{" "}
                          {exp.currentlyWorking ? "Present" : "End Date"}
                        </span>
                        <span>•</span>
                        <span>{exp.locationType || "On-site"}</span>
                      </div>
                      {exp.description && (
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed italic border-l-2 border-muted pl-3">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyContentSection message="No professional experience listed." />
          )}
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-black flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" /> Education
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.profile?.education && user.profile.education.length > 0 ? (
            user.profile.education.map((edu: any, idx: number) => (
              <Card
                key={idx}
                className="border-border/40 hover:bg-muted/5 transition-colors"
              >
                <CardContent className="p-5 flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="font-bold text-sm truncate">
                      {edu.school?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {edu.degree}
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mt-2">
                      {edu.duration?.[0]}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyContentSection message="No education history provided." />
            </div>
          )}
        </div>
      </section>

      {/* Verification Details */}
      {member.verification && (
        <section className="space-y-4">
          <h3 className="text-xl font-black flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Identity
            Verification
          </h3>
          <Card
            className={cn(
              "border-border/40 overflow-hidden bg-linear-to-r",
              member.verification.isVerified
                ? "from-green-500/5 to-transparent border-green-500/20"
                : "from-yellow-500/5 to-transparent border-yellow-500/20",
            )}
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div
                  className={cn(
                    "p-4 rounded-2xl",
                    member.verification.isVerified
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600",
                  )}
                >
                  {member.verification.isVerified ? (
                    <CheckCircle2 className="h-8 w-8" />
                  ) : (
                    <AlertCircle className="h-8 w-8" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg">
                      {member.verification.isVerified
                        ? "Verified Member"
                        : "Verification Pending"}
                    </h4>
                    {member.verification.isVerifiedAt && (
                      <span className="text-xs text-muted-foreground">
                        since{" "}
                        {new Date(
                          Number(member.verification.isVerifiedAt),
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.verification.verificationReason ||
                      (member.verification.isVerified
                        ? "This member has completed our identity verification process and is in good standing."
                        : "Verification is currently being processed for this account.")}
                  </p>
                </div>
                {member.verification.isVerified && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold tracking-widest border-green-500/30 text-green-600"
                  >
                    ID: {member.verification.id.slice(0, 8)}...
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* KYC Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-primary" /> Application Details
        </h3>
        <Card className="border-border/40 overflow-hidden bg-card/40 backdrop-blur-sm">
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Affliction
              </p>
              <p className="text-sm font-semibold">
                {member.userKyc?.affliction || "None"}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Referral Source
              </p>
              <p className="text-sm font-semibold">
                {member.userKyc?.referralSource || "Direct Search"}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Internal Note
              </p>
              <p className="text-sm font-medium italic text-muted-foreground">
                {member.userKyc?.comment || "No internal notes provided."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
