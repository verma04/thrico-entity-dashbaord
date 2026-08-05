"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MessageSquare,
  ChevronRight,
  Save,
  Image as ImageIcon,
  FileText,
  BarChart2,
} from "lucide-react";
import NewPoll from "../polls/new-poll";

import AddMedia from "./media";
import AllMedia from "./all-media";

import { useGetEntity } from "@/graphql/actions";
import { useAddFeed } from "@/graphql/actions/feed";
import UserAvatar from "../layout/user-avatar";
import { cn } from "@/lib/utils";
import { UploadFile } from "./types";

interface ImageItem {
  uid: string;
  name: string;
  status: "done" | "uploading" | "error";
  url: string;
  isExternalUrl?: boolean;
}

export default function PostModal() {
  const onCompleted = () => {
    handleCancel();
  };
  const [add, { loading: addLoading }] = useAddFeed({
    onCompleted,
  });
  const { data } = useGetEntity();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pollId, setPollId] = useState<string | number | null>(null);

  const [showPoll, setShowPoll] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPostText("");
    setFileList([]);
    setShowPoll(false);
    setPollId(null);
  };

  const handlePost = () => {
    add({
      variables: {
        input: {
          description: postText,
        },
      },
    });
  };

  return (
    <>
      {/* Entry Button View / Action Bar Style */}
      <TooltipProvider delayDuration={0}>
        <div className="flex items-center gap-2 p-1.5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
          <div
            onClick={showModal}
            className="flex-1 flex items-center gap-2.5 px-3 py-1.5 bg-muted/50 border border-border/40 rounded-xl cursor-pointer hover:bg-muted transition-all max-w-[240px]"
          >
            <UserAvatar
              size={24}
              src={data?.getEntity?.logo}
              className="rounded-lg shadow-sm border border-border bg-white shrink-0"
            />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">
              Share an update...
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 pr-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95"
                  onClick={() => {
                    showModal();
                    setShowPoll(false);
                  }}
                >
                  <ImageIcon className="h-4 w-4" strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-zinc-900 border-none font-bold text-[10px]"
              >
                Attach Media
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95"
                  onClick={() => {
                    showModal();
                    setShowPoll(true);
                  }}
                >
                  <BarChart2 className="h-4 w-4" strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-zinc-900 border-none font-bold text-[10px]"
              >
                Create Poll
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden rounded-[32px] border border-border shadow-2xl flex flex-col bg-background">
          {/* Header section - Ecosystem Style */}
          <div className="bg-card border-b border-border px-8 py-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <MessageSquare
                  className="h-6 w-6 text-primary-foreground"
                  strokeWidth={2}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground tracking-tight leading-none">
                    Create Post
                  </h1>
                  <Badge
                    variant="outline"
                    className="h-5 px-1.5 text-[10px] font-bold uppercase tracking-wider bg-muted/50 border-border/60"
                  >
                    Draft
                  </Badge>
                </div>
                <p className="text-[13px] text-muted-foreground font-medium mt-1">
                  Connect with your community ecosystem
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                type="button"
                className="rounded-xl px-4 h-10 font-semibold text-muted-foreground hover:text-foreground transition-all"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handlePost}
                disabled={!postText.trim() || addLoading}
                className="rounded-xl px-6 h-10 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {addLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Publish</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-muted/20">
            <div className="max-w-4xl mx-auto px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12 space-y-6">
                  {/* Post Content */}
                  <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-card">
                    <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                      <div className="flex items-center gap-4">
                        <UserAvatar
                          size={44}
                          src={data?.getEntity?.logo}
                          className="rounded-xl border border-border bg-white"
                        />
                        <div>
                          <CardTitle className="text-base font-bold text-foreground tracking-tight">
                            {data?.getEntity?.name || "Your Organization"}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                                Visible Now
                              </span>
                            </div>
                            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              Global Feed
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 pb-4 px-8 space-y-6">
                      <Textarea
                        placeholder="What's happening? Share a news update, a photo, or start a poll..."
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        className="min-h-[200px] p-2 resize-none text-lg leading-relaxed border-none bg-transparent focus-visible:ring-0 p-0 placeholder:text-muted-foreground/40 tracking-tight"
                        maxLength={1000}
                      />

                      <div className="flex items-center justify-between pt-4 border-t border-border/40">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "rounded-lg h-9 gap-2 px-3 text-xs font-bold transition-all",
                              !showPoll && !pollId
                                ? "text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50"
                                : "text-muted-foreground opacity-50 cursor-not-allowed",
                            )}
                            disabled={showPoll || !!pollId}
                          >
                            <ImageIcon className="h-4 w-4" />
                            Photo/Video
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "rounded-lg h-9 gap-2 px-3 text-xs font-bold transition-all",
                              showPoll
                                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
                                : pollId
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : "text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50",
                            )}
                            onClick={() => setShowPoll(!showPoll)}
                            disabled={fileList.length > 0}
                          >
                            <BarChart2 className="h-4 w-4" />
                            {showPoll
                              ? "Writing Text"
                              : pollId
                                ? "Poll Ready"
                                : "Add Poll"}
                          </Button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="h-5 w-5 rounded-full bg-muted border border-background flex items-center justify-center"
                              >
                                <Users className="h-2.5 w-2.5 text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                          <span
                            className={cn(
                              "text-[10px] font-bold tracking-widest uppercase",
                              postText.length > 900
                                ? "text-orange-500"
                                : "text-muted-foreground/60",
                            )}
                          >
                            {postText.length}/1000
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Poll Section */}
                  {showPoll && !pollId && (
                    <Card className="border-emerald-500/20 shadow-md shadow-emerald-500/5 rounded-2xl overflow-hidden bg-card animate-in fade-in slide-in-from-top-4 duration-300">
                      <CardHeader className="bg-emerald-50/30 pb-4 border-b border-emerald-500/10 px-8">
                        <div className="flex items-center gap-2">
                          <BarChart2 className="h-4 w-4 text-emerald-600" />
                          <CardTitle className="text-sm font-bold text-emerald-900 uppercase tracking-wider">
                            Create Interactive Poll
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="px-8 py-6">
                        <NewPoll
                          standalone={false}
                          onCompletedAction={(id) => {
                            setPollId(id);
                            setShowPoll(false);
                          }}
                          onCancel={() => setShowPoll(false)}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {pollId && (
                    <Card className="border-emerald-500/30 shadow-sm rounded-2xl overflow-hidden bg-emerald-50/20">
                      <CardContent className="p-5 flex items-center justify-between px-8">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200">
                            <BarChart2 className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-emerald-900">
                              Poll attached successfully
                            </p>
                            <p className="text-xs text-emerald-600/70 font-medium">
                              It will be published alongside your post.
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg px-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                          onClick={() => setPollId(null)}
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Media Section */}
                  {!showPoll && !pollId && (
                    <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-card">
                      <CardHeader className="bg-muted/30 pb-4 border-b border-border/50 flex flex-row items-center justify-between px-8">
                        <div>
                          <CardTitle className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">
                            Attachments & Visuals
                          </CardTitle>
                        </div>
                        <AddMedia
                          fileList={fileList}
                          setFileList={setFileList}
                        />
                      </CardHeader>
                      <CardContent className="pt-6 px-8 pb-8">
                        <AllMedia
                          fileList={fileList}
                          setFileList={setFileList}
                        />
                        {(!fileList || fileList.length === 0) && (
                          <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-2xl bg-muted/20">
                            <div className="h-12 w-12 rounded-xl bg-card flex items-center justify-center shadow-sm border border-border mb-3">
                              <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                              Gallery Preview
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Ensure you have these icons imported if they aren't already
import { Globe, Users } from "lucide-react";
