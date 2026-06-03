"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery, gql } from "@apollo/client";
import { AnnouncementCreationForm } from "@/components/trust-center/add/announcement-creation-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const GET_ANNOUNCEMENT = gql`
  query GetAnnouncement($id: ID!) {
    getAnnouncement(id: $id) {
      id
      subject
      description
      category
      allowReplies
      isActive
    }
  }
`;

const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($id: ID!, $input: UpdateAnnouncementInput!) {
    updateAnnouncement(id: $id, input: $input) {
      id
      subject
      description
      category
      allowReplies
      isActive
    }
  }
`;

const EditAnnouncementPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, loading: queryLoading, error } = useQuery(GET_ANNOUNCEMENT, {
    variables: { id },
    skip: !id,
  });

  const [updateMutation, { loading: updateLoading }] = useMutation(UPDATE_ANNOUNCEMENT, {
    onCompleted: () => {
      toast.success("Announcement updated successfully");
      router.push("/trust-center/announcements");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update announcement");
    },
  });

  const onFinish = (values: any) => {
    updateMutation({
      variables: {
        id,
        input: {
          subject: values.subject,
          description: values.description,
          category: values.category,
          isActive: values.isActive,
          allowReplies: data?.getAnnouncement?.allowReplies ?? true,
        },
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  if (queryLoading) {
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
        <button onClick={onCancel} className="text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <AnnouncementCreationForm
        initialValues={data.getAnnouncement}
        loading={updateLoading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default EditAnnouncementPage;
