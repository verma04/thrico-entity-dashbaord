"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  ThumbsDown,
  Edit as EditIcon,
  MoreHorizontal,
  List,
} from "lucide-react";
import { CtaButton as Button } from "@/components/ui/cta-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Edit from "./forum-category-edit";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { discussionCategory } from "../ts-types";

import {
  changeStatusDiscussionForumCategory,
  editDiscussionForumCategory,
} from "../../../graphql/actions/discussion-form";

const Actions = ({ record }: { record: discussionCategory }) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<
    | "APPROVE"
    | "BLOCK"
    | "DISABLE"
    | "ENABLE"
    | "UNBLOCK"
    | "REJECT"
    | "FLAG"
    | "VERIFY"
    | "UNVERIFY"
    | "REAPPROVE"
  >();

  const [changeStatus, { loading: statusLoading }] =
    changeStatusDiscussionForumCategory({});

  const onCompleted = () => {
    setOpen(false);
  };

  const [edit, { loading }] = editDiscussionForumCategory({
    onCompleted,
  });

  const handleStatusChange = (isActive: boolean) => {
    changeStatus({
      variables: {
        input: {
          id: record.id,
          isActive: isActive,
        },
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!record?.isActive && (
            <DropdownMenuItem
              onClick={() => handleStatusChange(true)}
              disabled={statusLoading}
            >
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Active Category
            </DropdownMenuItem>
          )}

          {record?.isActive && (
            <DropdownMenuItem
              onClick={() => handleStatusChange(false)}
              disabled={statusLoading}
            >
              <ThumbsDown className="mr-2 h-4 w-4 text-purple-600" />
              Inactive Category
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Edit
        record={record}
        edit={edit}
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
      />
    </>
  );
};

export default Actions;
