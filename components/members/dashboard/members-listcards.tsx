"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  ShieldCheck,
  UserCog,
  ExternalLink,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetAllUser, UserDetail } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { safeFormatDistanceToNow } from "@/lib/date-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserActions from "../users/user-actions";

interface MembersListCardsProps {
  manualData?: any[];
  loading?: boolean;
}

export const MembersListCards = ({
  manualData,
  loading: manualLoading,
}: MembersListCardsProps) => {
  const router = useRouter();
  const { data, loading: queryLoading } = useGetAllUser();

  const loading = manualLoading ?? queryLoading;
  const members = (manualData || data?.getAllUser || []) as UserDetail[];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-border/50 shadow-sm">
            <CardContent className="p-0">
              <div className="h-24 bg-muted animate-pulse" />
              <div className="p-6 -mt-12">
                <Skeleton className="h-20 w-20 rounded-2xl border-4 border-background mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="pt-4 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed rounded-2xl bg-muted/30">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Mail className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">No members found</h3>
        <p className="text-muted-foreground max-w-sm text-center mt-2">
          It looks like your community is just getting started. Invite some
          members to see them here!
        </p>
        <Button className="mt-6">Invite Members</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <Card
          key={member.id}
          className="group hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden bg-linear-to-b from-background to-muted/20"
        >
          <CardContent className="p-0">
            {/* Header Banner */}
            <div className="h-24 bg-linear-to-r from-blue-600/10 to-purple-600/10 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-colors" />

            <div className="px-6 pb-6 -mt-12">
              <div className="flex items-end justify-between mb-4">
                <button 
                  onClick={() => router.push(`/members/${member.id}`)}
                  className="relative group/avatar"
                >
                  <Avatar className="h-24 w-24 rounded-2xl border-4 border-background shadow-lg group-hover/avatar:scale-105 transition-transform duration-300 cursor-pointer">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}/${member.user.avatar}`}
                      alt={member.user.firstName}
                    />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {member.user.firstName[0]}
                      {member.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover/avatar:bg-black/5 transition-colors" />
                </button>

                <div className="flex gap-2 mb-2">
                  <Badge
                    variant={member.isApproved ? "default" : "secondary"}
                    className={`${member.isApproved ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"} border-none shadow-none`}
                  >
                    {member.isApproved ? "Approved" : "Pending"}
                  </Badge>

                  <UserActions user={member} />
                </div>
              </div>

              <div className="space-y-1">
                <button 
                  onClick={() => router.push(`/members/${member.id}`)}
                  className="text-xl font-bold tracking-tight hover:text-primary transition-colors text-left"
                >
                  {member.user.firstName} {member.user.lastName}
                </button>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>
                    {member.user.about?.currentPosition || member.status}
                  </span>
                </div>
              </div>

              {/* Bio/Headline */}
              <p className="mt-4 text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                {member.user.about?.about ||
                  member.user.about?.headline ||
                  "No bio information provided yet."}
              </p>

              {/* Industries */}
              {member.industries && member.industries.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {member.industries.slice(0, 3).map((ind: any) => (
                    <span 
                      key={ind.id} 
                      className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight bg-indigo-50 text-indigo-700 border border-indigo-100/50"
                    >
                      {ind.title}
                    </span>
                  ))}
                  {member.industries.length > 3 && (
                    <span className="text-[9px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
                      +{member.industries.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              {/* Last Session */}
              {member.lastSession && (
                <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground px-1">
                  <div className="relative">
                    <Smartphone className="h-3 w-3 shrink-0" />
                    {member.lastSession.isActive && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <span className="truncate">
                    Last active {safeFormatDistanceToNow(member.lastSession.lastUsed, { addSuffix: true })} on {member.lastSession.deviceName}
                  </span>
                </div>
              )}

              {/* Stats/Details */}
              <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    <Calendar className="h-3 w-3" /> Joined
                  </div>
                  <p className="text-xs font-semibold">
                    {safeFormatDistanceToNow(member.user.createdAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    <MapPin className="h-3 w-3" /> Location
                  </div>
                  <p className="text-xs font-semibold truncate">
                    {member.user.location?.name || "Remote"}
                  </p>
                </div>
              </div>

              {/* <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-9 gap-2 text-xs font-semibold"
                >
                  <Mail className="h-3.5 w-3.5" /> Message
                </Button>
                <Button className="flex-1 h-9 gap-2 text-xs font-semibold">
                  Edit Profile
                </Button>
              </div> */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
