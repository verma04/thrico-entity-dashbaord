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
import { MessageCircle, Send, MessageSquare } from "lucide-react";

import UserDetails from "./user-details";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddComment, useFeedComment } from "@/graphql/actions/feed";
import { useGetEntity } from "@/graphql/actions";
import UserAvatar from "@/components/layout/user-avatar";
import { Badge } from "@/components/ui/badge";

interface CommentsProps {
  id: number;
  totalComments?: number;
}

const Comments = ({ id, totalComments }: CommentsProps) => {
  const { data: feed, loading: feedLoading } = useFeedComment({
    variables: {
      input: {
        id,
      },
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState("");

  const onCompleted = () => {
    setValue("");
  };

  const [add, { loading }] = useAddComment({
    onCompleted,
  });

  const handleSubmit = () => {
    if (!value.trim()) return;
    add({
      variables: {
        input: {
          comment: value.trim(),
          feedID: id,
        },
      },
    });
  };

  const { data } = useGetEntity();
  const commentsList = feed?.getFeedComment || [];
  const commentCount = totalComments !== undefined ? totalComments : commentsList.length;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg h-8 px-2.5 font-medium text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center gap-1.5"
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
      >
        <MessageCircle className="h-4 w-4" />
        <span>
          Comment
          {commentCount > 0 && (
            <span className="font-semibold text-[11px] opacity-90 ml-1">
              ({commentCount})
            </span>
          )}
        </span>
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-[640px] max-h-[85vh] p-0 overflow-hidden rounded-2xl border border-border shadow-xl flex flex-col bg-background"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <DialogHeader className="p-5 border-b border-border/80 bg-card/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground tracking-tight">
                  Comments & Discussions
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Share insights and engage with the community
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Post comment input box */}
            <div className="flex gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/60">
              <UserAvatar
                size={36}
                src={data?.getEntity?.logo}
                className="rounded-xl border border-border bg-card shrink-0 mt-0.5"
              />
              <div className="flex-1 space-y-2.5 min-w-0">
                <Textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Add to the conversation..."
                  maxLength={1000}
                  className="resize-none rounded-lg border-border/70 bg-background focus:border-primary transition-all text-sm p-3 min-h-[70px]"
                  rows={2}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {value.length}/1000
                  </span>
                  <Button
                    onClick={handleSubmit}
                    loading={loading}
                    size="sm"
                    disabled={!value.trim()}
                    className="rounded-lg px-4 h-8 text-xs font-semibold gap-1.5 shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Post
                  </Button>
                </div>
              </div>
            </div>

            {/* Discussions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Discussions
                  </span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-[11px] font-semibold">
                    {commentsList.length}
                  </Badge>
                </div>
              </div>

              {feedLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ) : commentsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border/60 rounded-xl bg-muted/10">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-2">
                    <MessageCircle className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    No comments yet
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Be the first one to share your thoughts!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {commentsList.map((item: any) => (
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

