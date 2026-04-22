"use client";

import React, { useState } from "react";
import { useMentorshipRequests } from "@/graphql/mentorship/mentorship-quiries";
import { MentorEditor } from "@/components/mentorship/mentor-editor";
import { MentorActions } from "@/components/mentorship/mentor-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Info, Settings2 } from "lucide-react";
import { format } from "date-fns";
import { useEntitySettings } from "@/graphql/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function MentorshipRequestPage() {
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { data: settingsData } = useEntitySettings();

  const autoApprove = settingsData?.getEntitySettings?.autoApproveMentorship;

  const { data, loading, refetch } = useMentorshipRequests({
    variables: {
      input: {
        limit: 100,
        offset: 0,
      },
    },
  });

  const mentors = data?.mentorshipRequests || [];

  const handleEdit = (mentor: any) => {
    setSelectedMentor(mentor);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedMentor(null);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "displayName",
      header: "Name",
      cell: ({ row }) => {
        const mentor = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {mentor.user?.user?.avatar ? (
                <img
                  src={mentor.user.user.avatar}
                  alt={mentor.displayName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-primary">
                  {mentor.displayName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="font-medium">{mentor.displayName}</div>
              <div className="text-sm text-muted-foreground">
                {mentor.user?.user?.firstName} {mentor.user?.user?.lastName}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.category;
        return category ? (
          <Badge variant="outline">{category.title}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: "about",
      header: "About",
      cell: ({ row }) => {
        const about = row.original.about;
        return (
          <div className="max-w-md truncate text-sm text-muted-foreground">
            {about || "—"}
          </div>
        );
      },
    },
    {
      accessorKey: "isApproved",
      header: "Status",
      cell: ({ row }) => {
        const mentor = row.original;
        if (mentor.isApproved) {
          return (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Approved
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-200">
            Pending Review
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return date ? (
          <span className="text-sm text-muted-foreground">
            {format(new Date(date), "MMM dd, yyyy")}
          </span>
        ) : (
          "—"
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const mentor = row.original;
        return (
          <MentorActions
            mentor={mentor}
            onView={handleEdit}
            refetch={refetch}
          />
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Mentorship Request</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {mentors.length} pending mentor application
          {mentors.length !== 1 ? "s" : ""}
        </p>
      </div>

      {autoApprove ? (
        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
          <Settings2 className="h-4 w-4 stroke-amber-600" />
          <AlertTitle className="font-semibold text-amber-900">Auto-Approval Enabled</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your system is configured to <strong>automatically approve</strong> all mentor applications. New requests will not appear in this list as they bypass the review process. 
            To change this, visit <Link href="/mentorship/settings" className="underline font-medium hover:text-amber-900">Mentorship Settings</Link>.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4 stroke-blue-600" />
          <AlertTitle className="font-semibold text-blue-900">Manual Review Required</AlertTitle>
          <AlertDescription className="text-blue-700">
            Auto-approval is <strong>disabled</strong>. All incoming mentor applications will appear here and remain pending until you manually review and approve them.
          </AlertDescription>
        </Alert>
      )}

      <DataTable columns={columns} data={mentors} />

      <MentorEditor
        mentor={selectedMentor}
        open={isEditorOpen}
        onOpenChange={handleCloseEditor}
      />
    </div>
  );
}
