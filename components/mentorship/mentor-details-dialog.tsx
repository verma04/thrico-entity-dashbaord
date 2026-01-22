"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
    mentor.name ||
    `${mentor.user?.user?.firstName || ""} ${mentor.user?.user?.lastName || ""}`.trim() ||
    "Anonymous";
  const avatar = mentor.user?.user?.avatar || mentor.image;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mentor Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Profile Section */}
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20 border-2 border-primary/10">
              <AvatarImage src={avatar} alt={fullName} />
              <AvatarFallback className="bg-primary/5 text-primary">
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{fullName}</h3>
                  <p className="text-muted-foreground">
                    {mentor.intro || "Mentor"}
                  </p>
                </div>
                {mentor.isApproved ? (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                    <CheckCircle className="h-3 w-3 mr-1" /> Approved
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-200"
                  >
                    <Clock className="h-3 w-3 mr-1" /> Pending Review
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline" className="bg-muted/50">
                  {mentor.category?.title ||
                    mentor.categoryName ||
                    "Uncategorized"}
                </Badge>
                {mentor.createdAt && (
                  <div className="flex items-center text-muted-foreground ml-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    Submitted:{" "}
                    {format(new Date(mentor.createdAt), "MMM dd, yyyy")}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* About Section */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              About / Professional Bio
            </h4>
            <div className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg border border-border/50">
              {mentor.about || "No bio provided."}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Greatest Achievement
            </h4>
            <div className="text-sm text-foreground leading-relaxed">
              {mentor.greatestAchievement || "No achievements listed."}
            </div>
          </div>

          {/* Motivation Section */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-purple-500" />
              Motivation for Mentoring
            </h4>
            <div className="text-sm text-foreground leading-relaxed italic">
              "{mentor.whyDoWantBecomeMentor || "No motivation provided."}"
            </div>
          </div>

          {/* Video & Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {mentor.introVideo && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Video className="h-4 w-4 text-rose-500" />
                  Intro Video
                </h4>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a
                    href={mentor.introVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Watch Video
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </div>
            )}

            {mentor.featuredArticle && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-emerald-500" />
                  Featured Article
                </h4>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a
                    href={mentor.featuredArticle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Article
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
