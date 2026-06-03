"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Megaphone, ChevronRight } from "lucide-react";

const GET_ANNOUNCEMENT = gql`
  query GetAnnouncement($id: ID!) {
    getAnnouncement(id: $id) {
      id
      subject
      description
      category
      createdAt
    }
  }
`;

const ViewAnnouncementPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useQuery(GET_ANNOUNCEMENT, {
    variables: { id },
    skip: !id,
  });

  const onBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.getAnnouncement) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background space-y-4">
        <p className="text-muted-foreground">Announcement not found or an error occurred.</p>
        <Button onClick={onBack} variant="outline">
          Go back
        </Button>
      </div>
    );
  }

  const announcement = data.getAnnouncement;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
      {/* Header section - Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Megaphone className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {announcement.subject}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-14">
              <span>Trust Center</span>
              <ChevronRight className="h-3 w-3" />
              <span>Announcements</span>
              <ChevronRight className="h-3 w-3" />
              <span>View</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card className="w-full border-none shadow-sm ring-1 ring-border/50 bg-card overflow-hidden">
            <CardHeader className="border-b bg-muted/30 pb-6">
              <CardTitle className="text-2xl">
                {announcement.subject}
              </CardTitle>
              <CardDescription className="text-sm flex items-center gap-2 mt-2">
                <span className="bg-muted px-2.5 py-1 rounded-full border border-border font-medium text-foreground">
                  {announcement.category}
                </span>
                <span>•</span>
                <span>
                  {announcement.createdAt ? format(new Date(announcement.createdAt), "MMMM d, yyyy") : "N/A"}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div 
                className="bg-background rounded-md text-base prose prose-slate max-w-none dark:prose-invert min-h-[300px]"
                dangerouslySetInnerHTML={{ __html: announcement.description || "" }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewAnnouncementPage;
