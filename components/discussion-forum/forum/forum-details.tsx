"use client";

import { useState } from "react";
import moment from "moment";
import Link from "next/link";
import {
  CheckCircle,
  X,
  Undo2,
  ShieldCheck,
  ShieldOff,
  Lock,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { discussionForm } from "../ts-types";

import Vote from "./votes/forum-vote";
import Comment from "../forum-comments/forum-comment";
// import PostComment from "../forum-comments/forum-post-comment";
import { useGetEntity } from "@/graphql/actions";

const Details = ({
  selectedForum,
  isDrawerOpen,
  setIsDrawerOpen,
  handleAction,
}: {
  selectedForum: discussionForm | null;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  handleAction: (
    action:
      | "APPROVE"
      | "DISABLE"
      | "ENABLE"
      | "REJECT"
      | "VERIFY"
      | "UNVERIFY"
      | "REAPPROVE",
    user: discussionForm | null
  ) => void;
}) => {
  const { data: entity } = useGetEntity();

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent className="sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SheetTitle>Forum Post Details</SheetTitle>
              <SheetDescription>
                View and manage discussion forum post
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedForum?.status === "PENDING" && (
                <>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handleAction("APPROVE", selectedForum)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-2"
                    onClick={() => handleAction("REJECT", selectedForum)}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}

              {selectedForum?.status === "REJECTED" && (
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => handleAction("REAPPROVE", selectedForum)}
                >
                  <Undo2 className="h-4 w-4" />
                  Re-approve
                </Button>
              )}

              {selectedForum?.status === "APPROVED" && (
                <>
                  {selectedForum?.verification?.isVerified ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                      onClick={() => handleAction("UNVERIFY", selectedForum)}
                    >
                      <ShieldOff className="h-4 w-4" />
                      Remove Verification
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => handleAction("VERIFY", selectedForum)}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Verify
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleAction("DISABLE", selectedForum)}
                  >
                    <UserX className="h-4 w-4" />
                    Disable
                  </Button>
                </>
              )}

              {selectedForum?.status === "DISABLED" && (
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => handleAction("ENABLE", selectedForum)}
                >
                  <CheckCircle className="h-4 w-4" />
                  Enable
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        {selectedForum && (
          <div className="mt-6 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Vote id={selectedForum.id} />

                  <div className="flex-1 space-y-4">
                    {/* Post Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Link
                        href="#"
                        className="font-medium text-primary hover:underline"
                      >
                        {selectedForum.category?.name}
                      </Link>
                      <span>•</span>
                      <span>
                        Posted by{" "}
                        {selectedForum.addedBy === "ENTITY" &&
                          entity?.getEntity?.name}
                      </span>
                      <span>•</span>
                      <span>{moment(selectedForum.createdAt).fromNow()}</span>
                      {selectedForum?.isAnonymous && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Private
                          </Badge>
                        </>
                      )}
                    </div>

                    {/* Post Title */}
                    <h2 className="text-2xl font-bold tracking-tight">
                      {selectedForum.title}
                    </h2>

                    {/* Post Content */}
                    <p className="text-base whitespace-pre-line leading-relaxed">
                      {selectedForum.content}
                    </p>

                    <Separator />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comment Section */}
            {/* <PostComment id={selectedForum?.id} /> */}

            {selectedForum?.id && <Comment id={selectedForum?.id} />}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Details;
