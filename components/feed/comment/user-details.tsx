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
    <div className="flex gap-3">
      <UserAvatar
        size={48}
        src={addedBy === "USER" ? user?.avatar : data?.getEntity?.logo}
      />
      <div className="flex-1">
        <div className="font-semibold text-sm">
          {addedBy === "USER" && (
            <span>
              {user?.firstName} {user?.lastName}
            </span>
          )}
          {addedBy === "ENTITY" && <span>{data?.getEntity?.name}</span>}
        </div>

        {editingId === id ? (
          <div className="mt-2 space-y-2">
            <Textarea
              rows={3}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button type="primary" size="sm">
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground mt-1">{content}</p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground">
                  {moment(createdAt).fromNow()}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {moment(createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {editingId !== id && (
            <div className="flex gap-1 ml-2">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(id)}>
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
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
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
