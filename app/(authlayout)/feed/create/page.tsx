"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageSquarePlus } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PostCreationForm } from "@/components/feed/create/post-creation-form";
import { useAddFeed } from "@/graphql/actions/feed";

export default function CreateFeedPostPage() {
  const router = useRouter();

  const [addFeed, { loading }] = useAddFeed({
    onCompleted: () => {
      toast.success("Post published successfully!", {
        description:
          "Your post is now live and distributed to the community feed.",
      });
      router.push("/feed/all");
    },
    onError: (error: any) => {
      toast.error("Failed to publish post", {
        description:
          error.message || "An unexpected error occurred. Please try again.",
      });
    },
  });

  const onFinish = (values: any) => {
    const isPoll = values.postType === "poll";
    const descriptionText =
      values.description?.trim() ||
      (isPoll ? values.poll?.question?.trim() : "") ||
      "Community Post";

    const input: any = {
      description: descriptionText,
    };

    if (values.media && values.media.length > 0) {
      input.media = values.media;
    }

    if (values.source) {
      input.source = isPoll ? "poll" : values.source === "feed" ? "admin" : values.source;
    } else if (isPoll) {
      input.source = "poll";
    }

    if (values.privacy) {
      input.privacy = values.privacy;
    }

    if (typeof values.isPinned === "boolean") {
      input.isPinned = values.isPinned;
    }

    if (isPoll && values.poll) {
      const validOptions = (values.poll.options || [])
        .map((opt: any) =>
          typeof opt === "string" ? opt : opt.option || opt.text,
        )
        .filter((text: string) => Boolean(text && text.trim()))
        .map((optText: string) => ({ option: optText.trim() }));

      const durationDays = Number(values.poll.durationDays) || 7;
      const endDate = new Date(
        Date.now() + durationDays * 24 * 60 * 60 * 1000,
      );
      const question = values.poll.question?.trim() || descriptionText;
      const title = values.poll.title?.trim() || question || "Community Poll";

      input.poll = {
        title,
        question,
        options: validOptions,
        resultVisibility: values.poll.resultVisibility || "ALWAYS",
        endDate: endDate.toISOString(),
      };
      input.source = "poll";
    }

    addFeed({
      variables: {
        input,
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <EcosystemWrapper className="animate-in fade-in duration-700">
      <EcosystemHeader
        title="Create Feed Post"
        description="Share announcements, news updates, discussions, media, or polls with your community ecosystem."
        icon={MessageSquarePlus}
        badgeText="Community Feed"
        breadcrumbs={[
          { label: "Feed", href: "/feed" },
          { label: "Create Post" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 mt-3 pb-16">
        <PostCreationForm
          loading={loading}
          onFinish={onFinish}
          onCancel={onCancel}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
