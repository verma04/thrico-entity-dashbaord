"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Calendar,
  BookOpen,
  Award,
  Video,
  HelpCircle,
  ExternalLink,
  CheckCircle,
  Clock,
  Briefcase,
  Star,
  Quote,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface MentorDetailsDialogProps {
  mentor: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MentorDetailsDialog({
  mentor,
  open,
  onOpenChange,
}: MentorDetailsDialogProps) {
  if (!mentor) return null;

  const fullName =
    mentor.displayName ||
    `${mentor.user?.user?.firstName || ""} ${mentor.user?.user?.lastName || ""}`.trim() ||
    "Anonymous";
  const avatar = mentor.user?.user?.avatar || mentor.image;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 border-l border-slate-200 shadow-xl"
      >
        <ScrollArea className="h-full bg-white">
          <div className="p-8 space-y-8">
            {/* Simple Profile Header */}
            <div className="flex items-center gap-5">
              <Avatar className="h-16 w-16 border border-slate-200">
                <AvatarImage src={avatar} alt={fullName} />
                <AvatarFallback className="bg-slate-50 text-slate-400">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  {fullName}
                  {mentor.isTopMentor && (
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  )}
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                   <span className="font-medium text-indigo-600">
                    {mentor.category?.title || mentor.categoryName || "Mentor"}
                   </span>
                   {mentor.mentorSince && (
                     <>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span>Joined {format(new Date(mentor.mentorSince), "MMM yyyy")}</span>
                     </>
                   )}
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Application Status Row */}
            <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Status</p>
                {mentor.isApproved ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                    <CheckCircle className="h-4 w-4" /> Approved
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-sm">
                    <Clock className="h-4 w-4" /> Pending
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-right">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Agreement</p>
                {mentor.agreement ? (
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-sm justify-end">
                    Verified <ShieldCheck className="h-4 w-4 text-indigo-500" />
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 italic">Not Signed</span>
                )}
              </div>
            </div>

            {/* Intro Header */}
            <div>
              <p className="text-lg leading-relaxed text-slate-700 font-medium">
                &ldquo;{mentor.intro || "Dedicated to helping others grow and succeed through professional mentorship."}&rdquo;
              </p>
            </div>

            {/* Skills Cloud */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Core Expertise</p>
              <div className="flex flex-wrap gap-2">
                {mentor.skills?.length > 0 ? (
                  mentor.skills.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-white border-slate-200 text-slate-600 font-medium px-2 py-0.5 rounded-md hover:bg-slate-50 transition-colors">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills listed</span>
                )}
              </div>
            </div>

            {/* Detailed Content Sections */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">About the Mentor</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {mentor.about || mentor.description || "No biography provided."}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">Key Achievement</h4>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{mentor.greatestAchievement || "Committed to excellence in their professional field."}&rdquo;
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">Mentorship Motivation</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {mentor.whyDoWantBecomeMentor || "To share knowledge and foster growth within the community."}
                </p>
              </div>
            </div>

            {/* Simple Resource Links */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 h-9",
                    !mentor.introVideo && "opacity-50 pointer-events-none"
                  )}
                  asChild={!!mentor.introVideo}
                >
                  {mentor.introVideo ? (
                    <a href={mentor.introVideo} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" /> Intro Video
                    </a>
                  ) : (
                    <span><Video className="h-4 w-4 mr-2" /> No Video</span>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 h-9",
                    !mentor.featuredArticle && "opacity-50 pointer-events-none"
                  )}
                  asChild={!!mentor.featuredArticle}
                >
                  {mentor.featuredArticle ? (
                    <a href={mentor.featuredArticle} target="_blank" rel="noopener noreferrer">
                      <BookOpen className="h-4 w-4 mr-2" /> Featured Work
                    </a>
                  ) : (
                    <span><BookOpen className="h-4 w-4 mr-2" /> No Article</span>
                  )}
                </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
