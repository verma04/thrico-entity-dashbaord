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

const Comments = ({ id }: { id: number }) => {
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

          <div className="space-y-6">
            <div className="flex gap-4 p-1">
              <UserAvatar 
                size={40} 
                src={data?.getEntity?.logo} 
                className="rounded-xl shadow-sm shrink-0"
              />
              <div className="flex-1 space-y-3">
                <Textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Share your thoughts..."
                  maxLength={1000}
                  className="resize-none rounded-[15px] border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all text-[14px] p-3"
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                    {value.length} / 1000
                  </span>
                  <Button 
                    onClick={handleSubmit} 
                    loading={loading} 
                    size="sm"
                    disabled={!value.trim()}
                    className="rounded-full px-6 font-bold h-9 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-200 transition-all"
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <h4 className="text-[12px] font-black uppercase tracking-[0.15em] text-zinc-400">
                  {feed?.getFeedComment?.length || 0} Discussions
                </h4>
                <div className="h-px flex-1 bg-zinc-100" />
              </div>
              
              {feedLoading ? (
                <div className="space-y-4 px-1">
                  <Skeleton className="h-20 w-full rounded-2xl" />
                  <Skeleton className="h-20 w-full rounded-2xl" />
                </div>
              ) : (
                <div className="space-y-1">
                  {feed?.getFeedComment?.map((item: any) => (
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
