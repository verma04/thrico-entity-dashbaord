"use client";

import React, { useEffect } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserProfile } from "@/components/grapqhl/queries/profile";
import {
  Briefcase,
  GraduationCap,
  Building2,
  Wrench,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { getMediaUrl } from "@/utils/utils";

interface UserHoverCardProps {
  userId: string;
  children: React.ReactNode;
}

export function UserHoverCard({ userId, children }: UserHoverCardProps) {
  const [fetchProfile, { data, loading, error }] = useGetUserProfile();

  const handleOpenChange = (open: boolean) => {
    if (open && !data && !loading && userId) {
      fetchProfile({ variables: { input: { id: userId } } });
    }
  };

  const profile = data?.getUserProfile;
  const user = profile?.user || profile;

  const fallbackText = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase()
    : "U";

  const currentExp = profile?.currentCompany?.[0];
  const currentEdu = profile?.currentEducation?.[0];
  const industries = profile?.industries || [];
  const skills = profile?.jobFunctions || profile?.skills || [];
  const interests = profile?.interests || [];

  return (
    <HoverCard onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer">{children}</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 overflow-hidden z-50">
        {loading ? (
          <div className="flex flex-col">
            <Skeleton className="h-16 w-full rounded-none" />
            <div className="px-4 pb-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-16 w-16 rounded-full border-4 border-background -mt-8 relative z-10" />
                <div className="mt-2">
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="mt-4 flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ) : error || !profile ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Failed to load profile.
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Cover Image */}
            <div className="h-16 w-full bg-muted relative">
              {profile.cover || user?.cover ? (
                <img
                  src={getMediaUrl(profile.cover || user?.cover) || ""}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-primary/20" />
              )}
            </div>

            <div className="px-4 pb-4">
              <div className="flex justify-between items-start">
                <Avatar className="h-16 w-16 border-4 border-background -mt-8 relative z-10">
                  <AvatarImage
                    src={user?.avatar ? getMediaUrl(user.avatar) || "" : ""}
                  />
                  <AvatarFallback className="text-lg font-semibold bg-muted">
                    {fallbackText}
                  </AvatarFallback>
                </Avatar>

                <div className="mt-2 flex items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="h-8">
                    <Link
                      href={`/dashboard/network/profile/${user?.id || userId}`}
                    >
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-2">
                <h4 className="text-base font-semibold flex items-center gap-2">
                  {user?.firstName} {user?.lastName}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {profile.designation ||
                    (profile.currentCompany &&
                      profile.currentCompany[0]?.title) ||
                    "Member"}
                </p>
              </div>

              {(currentExp ||
                currentEdu ||
                industries.length > 0 ||
                skills.length > 0 ||
                interests.length > 0) && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  {currentExp && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Briefcase className="h-3 w-3 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0 flex items-center gap-1.5">
                        <span className="truncate font-semibold text-slate-800">
                          {currentExp.title}
                        </span>
                        <span className="shrink-0 text-slate-400 text-[10px]">
                          at
                        </span>
                        <span className="truncate">
                          {currentExp.company?.name || "Company"}
                        </span>
                      </div>
                    </div>
                  )}

                  {currentEdu && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <GraduationCap className="h-3 w-3 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0 flex items-center gap-1.5">
                        <span className="truncate font-semibold text-slate-800">
                          {currentEdu.school?.name}
                        </span>
                        {currentEdu.degree && (
                          <>
                            <span className="shrink-0 text-slate-400 text-[10px]">
                              •
                            </span>
                            <span className="truncate">
                              {currentEdu.degree}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {industries.length > 0 && !currentExp && !currentEdu && (
                    <div className="flex items-start gap-2.5">
                      <div className="bg-slate-50 p-1.5 rounded-md mt-0.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-wrap gap-1 mt-1">
                        {industries.slice(0, 3).map((ind: any) => (
                          <span
                            key={ind.title || ind.id || ind}
                            className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-semibold border border-slate-100"
                          >
                            {ind.title || ind.name || ind}
                          </span>
                        ))}
                        {industries.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded text-[10px] font-semibold">
                            +{industries.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className="flex items-start gap-2.5">
                      <div className="bg-slate-50 p-1.5 rounded-md mt-0.5">
                        <Wrench className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-wrap gap-1 mt-1">
                        {skills.slice(0, 3).map((skill: any) => (
                          <span
                            key={skill.name || skill.id || skill}
                            className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-semibold"
                          >
                            {skill.name || skill.title || skill}
                          </span>
                        ))}
                        {skills.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded text-[10px] font-semibold">
                            +{skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {interests.length > 0 && (
                    <div className="flex items-start gap-2.5">
                      <div className="bg-slate-50 p-1.5 rounded-md mt-0.5">
                        <Heart className="h-3.5 w-3.5 text-rose-400" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-wrap gap-1 mt-1">
                        {interests.slice(0, 3).map((interest: any) => (
                          <span
                            key={interest.title || interest.id || interest}
                            className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-semibold border border-rose-100"
                          >
                            {interest.title || interest.name || interest}
                          </span>
                        ))}
                        {interests.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded text-[10px] font-semibold">
                            +{interests.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
