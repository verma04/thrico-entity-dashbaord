"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation, gql } from "@apollo/client";
import { AnnouncementCreationForm } from "@/components/trust-center/add/announcement-creation-form";
import { toast } from "sonner";

const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
    createAnnouncement(input: $input) {
      id
      highlightsType
      entity
      isExpirable
      expiry
      announcementId
    }
  }
`;

const CreateAnnouncementPage = () => {
  const router = useRouter();

  const [createMutation, { loading }] = useMutation(CREATE_ANNOUNCEMENT, {
    onCompleted: () => {
      toast.success("Announcement created successfully");
      router.push("/trust-center/announcements");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create announcement");
    },
  });

  const onFinish = (values: any) => {
    createMutation({
      variables: {
        input: {
          subject: values.subject,
          description: values.description,
          category: values.category,
          isActive: values.isActive,
          allowReplies: true,
          ttl: "no",
        },
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="h-full overflow-hidden">
      <AnnouncementCreationForm
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default CreateAnnouncementPage;
