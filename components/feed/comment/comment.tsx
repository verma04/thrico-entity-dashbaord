"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";

import UserDetails from "./user-details";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddComment, useFeedComment } from "@/graphql/actions/feed";
import { useGetEntity } from "@/graphql/actions";
import UserAvatar from "@/components/layout/user-avatar";

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  content: string;
  datetime: string;
}

const Comments = ({ id }: number) => {
  const { data: feed, loading: feedLoading } = useFeedComment({
    variables: {
      input: {
        id,
      },
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");

  const onCompleted = () => {
    setValue("");
  };

  const [add, { loading }] = useAddComment({
    onCompleted,
  });

  const handleSubmit = () => {
    add({
      variables: {
        input: {
          comment: value,
          feedID: id,
        },
      },
    });
  };

  const { data } = useGetEntity();

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)}>
        <MessageCircle className="h-4 w-4" />
        Comment
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-4">
              <UserAvatar size={48} src={data?.getEntity?.logo} />
              <div className="flex-1 space-y-2">
                <Textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Write a comment..."
                  maxLength={1000}
                  className="resize-none"
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {value.length}/1000
                  </span>
                  <Button onClick={handleSubmit} loading={loading} size="sm">
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">
                {feed?.getFeedComment?.length}{" "}
                {feed?.getFeedComment?.length > 1 ? "comments" : "comment"}
              </h4>
              {feedLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {feed?.getFeedComment?.map((item) => (
                    <UserDetails key={item.id} {...item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Comments;
