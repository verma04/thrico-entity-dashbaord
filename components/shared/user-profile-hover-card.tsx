"use client";

import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Building2,
  GraduationCap,
  CheckCircle2,
  CalendarDays,
  Wrench,
  Heart,
  ArrowRight,
} from "lucide-react";
import { useGetUserDetailsById } from "@/graphql/actions/membership/membership-queries";
import { format } from "date-fns";
import { getPreferredMediaUrl } from "@/lib/media-utils";

export interface UserProfileHoverData {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  headline?: string | null;
}

export function UserProfileHoverCard({
  user,
  children,
}: {
  user: UserProfileHoverData;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch full profile details when the hover card is open
  const { data, loading } = useGetUserDetailsById({
    variables: { input: { id: user.id } },
    skip: !isOpen || !user.id,
  });

  const fullData = data?.getUserDetailsById;
  const userDetails = fullData?.user;

  // Deduplicate arrays
  const industries = Array.from(
    new Map(
      (fullData?.industries || []).map((i: any) => [i.title, i]),
    ).values(),
  );
  const skills = Array.from(
    new Map((fullData?.skills || []).map((s: any) => [s.name, s])).values(),
  );
  const interests = Array.from(
    new Map((fullData?.interests || []).map((i: any) => [i.title, i])).values(),
  );

  const isVerified = fullData?.verification?.isVerified;
  const isOnline = fullData?.isOnline;

  // Determine which data to show (prefer fetched full data over initial basic data)
  const avatarToUse = userDetails?.avatar || user.avatar;
  const avatarUrl = getPreferredMediaUrl(avatarToUse);

  const coverUrl = getPreferredMediaUrl(userDetails?.cover);

  const firstName = userDetails?.firstName || user.firstName || "";
  const lastName = userDetails?.lastName || user.lastName || "";
  const initials = firstName ? firstName.charAt(0) : "U";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";

  const headline = userDetails?.about?.headline || user.headline;

  // Safely extract location string
  let locationStr = "";
  if (userDetails?.location) {
    if (typeof userDetails.location === "string") {
      locationStr = userDetails.location;
    } else if (
      typeof userDetails.location === "object" &&
      "name" in userDetails.location
    ) {
      locationStr = (userDetails.location as any).name;
    }
  }

  // Get current experience (first one that is currently working, or just first one)
  const experiences = userDetails?.profile?.experience || [];
  const currentExp =
    experiences.find((exp: any) => exp?.currentlyWorking) || experiences[0];

  // Get highest education
  const educations = userDetails?.profile?.education || [];
  const currentEdu = educations[0];

  // Format joined date
  const joinedDate = userDetails?.createdAt
    ? format(new Date(parseInt(userDetails.createdAt)), "MMMM yyyy")
    : null;

  return (
    <HoverCard openDelay={300} closeDelay={200} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 overflow-hidden shadow-xl border-slate-200 rounded-xl bg-white"
        side="right"
        align="start"
      >
        {loading && isOpen && !fullData ? (
          <div className="flex flex-col bg-slate-50">
            <div className="h-24 w-full bg-slate-200 animate-pulse relative">
              <Skeleton className="h-16 w-16 rounded-full absolute -bottom-6 left-5 border-4 border-white" />
            </div>
            <div className="pt-8 px-5 pb-5 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-start gap-2.5">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className="h-24 w-full relative bg-slate-200"
              style={
                coverUrl
                  ? {
                      backgroundImage: `url(${coverUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : {
                      backgroundImage:
                        "linear-gradient(to right, #6366f1, #9333ea)",
                    }
              }
            >
              <div className="absolute -bottom-14 left-5 relative w-16 h-16">
                <Avatar className="h-16 w-16 border-4 border-white shadow-sm bg-white">
                  <AvatarImage
                    src={avatarUrl}
                    alt={fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-indigo-50 text-indigo-700 text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 z-10" />
                )}
              </div>
            </div>

            <div className="pt-8 px-5 pb-5 bg-white">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-lg text-slate-900 leading-tight">
                  {fullName}
                </h4>
                {isVerified && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
              </div>

              {headline && (
                <p className="text-sm text-slate-600 mt-1 font-medium leading-snug">
                  {headline}
                </p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                {locationStr && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{locationStr}</span>
                  </div>
                )}

                {joinedDate && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">
                      Joined {joinedDate}
                    </span>
                  </div>
                )}
              </div>

              {(currentExp ||
                currentEdu ||
                industries.length > 0 ||
                skills.length > 0 ||
                interests.length > 0) && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  {currentExp && (
                    <div className="flex items-start gap-2.5">
                      <div className="bg-slate-50 p-1.5 rounded-md mt-0.5">
                        <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {currentExp.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {currentExp.company?.name || "Company"}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentEdu && (
                    <div className="flex items-start gap-2.5">
                      <div className="bg-slate-50 p-1.5 rounded-md mt-0.5">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {currentEdu.school?.name}
                        </p>
                        {currentEdu.degree && (
                          <p className="text-xs text-slate-500 truncate">
                            {currentEdu.degree}
                          </p>
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
                            key={ind.title}
                            className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-semibold border border-slate-100"
                          >
                            {ind.title}
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
                            key={skill.name}
                            className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-semibold"
                          >
                            {skill.name}
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
                            key={interest.title}
                            className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-semibold border border-rose-100"
                          >
                            {interest.title}
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

              {/* View Profile CTA */}
              <div className="mt-5">
                <Link href={`/members/${fullData?.id}`} passHref>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold rounded-lg h-9 gap-1.5 transition-all group/btn">
                    View Full Profile
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
