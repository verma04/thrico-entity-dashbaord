"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { useState } from "react";
import type { commentProps } from "../types";

import { Trash2, Edit2 } from "lucide-react";

import { useGetEntity } from "@/graphql/actions";
import { useDeleteCommentFeed } from "@/graphql/actions/feed";
import UserAvatar from "@/components/layout/user-avatar";

const UserDetails = ({
  id,
  user,
  createdAt,
  addedBy,
  content,
}: commentProps) => {
  const { data, loading } = useGetEntity();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (id: string) => {
    setEditingId(id);
    setEditValue(content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const [deleteComment, { loading: deleteBtnLoading }] = useDeleteCommentFeed(
    {}
  );

  return (
    <div className="flex gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group">
      <UserAvatar
        size={36}
        src={addedBy === "USER" ? user?.avatar : data?.getEntity?.logo}
        className="rounded-lg shadow-sm shrink-0 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-[13px] text-zinc-900 leading-none">
            {addedBy === "USER" ? (
              `${user?.firstName} ${user?.lastName}`
            ) : (
              data?.getEntity?.name
            )}
          </span>
          <span className="text-zinc-300 select-none text-[10px]">•</span>
          <span className="text-[11px] font-medium text-zinc-400">
            {moment(createdAt).fromNow()}
          </span>
        </div>

        {editingId === id ? (
          <div className="mt-2 space-y-2">
            <Textarea
              rows={3}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="resize-none rounded-xl border-zinc-200 focus:ring-zinc-900"
            />
            <div className="flex gap-2">
              <Button size="sm" className="rounded-full px-4 font-bold h-8">
                Save
              </Button>
              <Button variant="outline" size="sm" className="rounded-full px-4 font-bold h-8" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-[14px] leading-relaxed text-zinc-600 font-medium wrap-break-word">
            {content}
          </p>
        )}

        <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {editingId !== id && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100" onClick={() => handleEdit(id)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50"
                onClick={() =>
                  deleteComment({
                    variables: {
                      input: {
                        commentId: id,
                      },
                    },
                  })
                }
                loading={deleteBtnLoading}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
