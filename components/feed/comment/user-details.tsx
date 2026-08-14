"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { useState } from "react";
import type { commentProps } from "../types";

import { Trash2, Edit2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const { data } = useGetEntity();
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

  const [deleteComment, { loading: deleteBtnLoading }] = useDeleteCommentFeed({});

  const isEntity = addedBy === "ENTITY";
  const authorName = isEntity
    ? data?.getEntity?.name || "Community Management"
    : `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Member";
  const avatarSrc = isEntity ? data?.getEntity?.logo : user?.avatar;

  return (
    <div className="flex gap-3 py-3 group">
      <div className="relative shrink-0">
        <UserAvatar
          size={34}
          src={avatarSrc}
          className="rounded-lg border border-border/80 shadow-xs bg-card mt-0.5"
        />
        {isEntity && (
          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-primary border border-card flex items-center justify-center">
            <ShieldCheck className="h-2 w-2 text-primary-foreground" />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-xs text-foreground tracking-tight leading-none">
            {authorName}
          </span>
          {isEntity && (
            <Badge
              variant="outline"
              className="text-[9px] font-semibold px-1 py-0 h-3.5 bg-primary/10 text-primary border-primary/20 leading-none"
            >
              Official
            </Badge>
          )}
          <span className="text-muted-foreground/40 text-[10px] select-none">•</span>
          <span className="text-[11px] text-muted-foreground font-normal leading-none">
            {moment(createdAt).fromNow()}
          </span>

          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {editingId !== id && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
                  onClick={() => handleEdit(id)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
              </>
            )}
          </div>
        </div>

        {editingId === id ? (
          <div className="mt-2 space-y-2">
            <Textarea
              rows={2}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="resize-none rounded-lg border-border text-xs"
            />
            <div className="flex gap-2">
              <Button size="sm" className="rounded-lg px-3 font-semibold h-7 text-xs">
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg px-3 font-semibold h-7 text-xs"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-[13px] leading-relaxed text-foreground/90 font-normal mt-1 break-words">
            {content}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;

