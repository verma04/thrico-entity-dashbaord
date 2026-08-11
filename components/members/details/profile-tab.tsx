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
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EmptyContentSection } from "./detail-states";
import { safeLocaleDateString } from "@/lib/date-utils";

/* ── Section Header ──────────────────────────────────────────────────────── */

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4" /> {children}
    </h3>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export function ProfileTab({ member }: { member: any }) {
  const user = member?.user;
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* About */}
      {(user.about?.about || user.about?.headline) && (
        <section>
          <SectionTitle icon={UserIcon}>About</SectionTitle>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {user.about?.about || user.about?.headline}
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Experience */}
      <section>
        <SectionTitle icon={Briefcase}>Experience</SectionTitle>
        {user.profile?.experience && user.profile.experience.length > 0 ? (
          <div className="space-y-3">
            {user.profile.experience.map((exp: any, idx: number) => (
              <Card key={idx} className="border-border">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      {exp.company?.logo ? (
                        <img src={exp.company.logo} alt="" className="h-6 w-6 object-contain" />
                      ) : (
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{exp.title}</p>
                      <p className="text-xs text-muted-foreground">{exp.company?.name}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {exp.startDate} — {exp.currentlyWorking ? "Present" : "End Date"}
                        </span>
                        {exp.locationType && (
                          <>
                            <span>·</span>
                            <span>{exp.locationType}</span>
                          </>
                        )}
                      </div>
                      {exp.description && (
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyContentSection message="No professional experience listed." />
        )}
      </section>

      {/* Education */}
      <section>
        <SectionTitle icon={GraduationCap}>Education</SectionTitle>
        {user.profile?.education && user.profile.education.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {user.profile.education.map((edu: any, idx: number) => (
              <Card key={idx} className="border-border">
                <CardContent className="p-4 flex gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{edu.school?.name}</p>
                    <p className="text-xs text-muted-foreground">{edu.degree}</p>
                    {edu.duration?.[0] && (
                      <p className="text-[11px] text-muted-foreground mt-1">{edu.duration[0]}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyContentSection message="No education history provided." />
        )}
      </section>

      {/* Industries */}
      {member.industries && member.industries.length > 0 && (
        <section>
          <SectionTitle icon={Briefcase}>Industries</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {member.industries.map((industry: any) => (
              <Badge key={industry.id} variant="secondary" className="text-xs font-medium">
                {industry.title}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Job Functions */}
      {member.jobFunctions && member.jobFunctions.length > 0 && (
        <section>
          <SectionTitle icon={Briefcase}>Job Functions</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {member.jobFunctions.map((jf: any) => (
              <Badge key={jf.id} variant="secondary" className="text-xs font-medium">
                {jf.title}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Interests */}
      {member.interests && member.interests.length > 0 && (
        <section>
          <SectionTitle icon={GraduationCap}>Interests</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {member.interests.map((interest: any) => (
              <Badge key={interest.id} variant="secondary" className="text-xs font-medium">
                {interest.title}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {member.skills && member.skills.length > 0 && (
        <section>
          <SectionTitle icon={GraduationCap}>Skills</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {member.skills.map((skill: any) => (
              <Badge key={skill.skillId || skill.id} variant="secondary" className="text-xs font-medium">
                {skill.name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Verification */}
      {member.verification && (
        <section>
          <SectionTitle icon={ShieldCheck}>Verification</SectionTitle>
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={cn(
                  "p-3 rounded-lg",
                  member.verification.isVerified
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600",
                )}
              >
                {member.verification.isVerified ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {member.verification.isVerified ? "Verified Member" : "Pending Verification"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {member.verification.verificationReason ||
                    (member.verification.isVerified
                      ? "Identity verification completed."
                      : "Verification is being processed.")}
                </p>
              </div>
              {member.verification.isVerifiedAt && (
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {safeLocaleDateString(member.verification.isVerifiedAt)}
                </span>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* KYC / Application Details */}
      <section>
        <SectionTitle icon={MapIcon}>Application Details</SectionTitle>
        <Card className="border-border">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Affliction</p>
              <p className="text-sm font-medium">{member.userKyc?.affliction || "None"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Referral Source</p>
              <p className="text-sm font-medium">{member.userKyc?.referralSource || "Direct"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Internal Note</p>
              <p className="text-sm text-muted-foreground italic">
                {member.userKyc?.comment || "No notes."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
