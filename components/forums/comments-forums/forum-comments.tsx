"use client";

import { useState } from "react";
import Link from "next/link";
import moment from "moment";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { formComment } from "../ts-types";
import { useGetEntity } from "../../../graphql/actions";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";

function CommentCard({ comment, id }: { comment: formComment; id: string }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const [deleteComment, { loading }] = deleteDiscussionForumComments({});
  const { data } = useGetEntity();

  const handleDelete = async () => {
    try {
      await deleteComment({
        variables: {
          input: { commentId: comment.id, discussionForumId: id },
        },
      });
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
      setShowDeleteDialog(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex gap-4 relative">
            <div className="absolute top-0 right-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">

                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="pt-1">
              {comment?.commentedBy === "USER" && comment?.user ? (
                <UserAvatar size={36} src={comment?.user?.avatar} />
              ) : (
                <UserAvatar size={36} src={data?.getEntity?.logo} />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {comment?.commentedBy === "USER" && comment?.user ? (
                  <UserProfileHoverCard user={comment.user}>
                    <div className="font-semibold text-sm cursor-pointer hover:underline">
                      {comment?.user?.firstName} {comment?.user?.lastName}
                    </div>
                  </UserProfileHoverCard>
                ) : (
                  <Link href="" className="font-semibold text-sm hover:underline">
                    u/{data?.getEntity?.name}
                  </Link>
                )}
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {moment(comment?.createdAt).fromNow()}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{comment?.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

import {
  deleteDiscussionForumComments,
  getDiscussionForumComments,
} from "../../../graphql/actions/discussion-form";
import UserAvatar from "@/components/layout/user-avatar";

const Comment = ({ id }: { id: string }) => {
  const { data, loading } = getDiscussionForumComments({
    variables: {
      input: {
        id: id,
      },
    },
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data?.getDiscussionForumComments?.length) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground text-sm">
            No comments yet. Be the first to comment!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data?.getDiscussionForumComments?.map((comment: formComment) => (
        <CommentCard key={comment.id} comment={comment} id={id} />
      ))}
    </div>
  );
};

export default Comment;
