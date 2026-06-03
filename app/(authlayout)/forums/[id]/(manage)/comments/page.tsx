"use client";

import { useParams } from "next/navigation";
import Comment from "@/components/discussion-forum/comments/forum-comment";
import PostComment from "@/components/discussion-forum/comments/forum-post-comment";

export default function ForumCommentsPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Forum Comments</h2>
        <p className="text-sm text-muted-foreground">
          Manage discussion comments and post new ones.
        </p>
      </div>

      <PostComment id={id} />

      <div className="pt-4">
        <h3 className="text-lg font-medium mb-4">All Comments</h3>
        <Comment id={id} />
      </div>
    </div>
  );
}
