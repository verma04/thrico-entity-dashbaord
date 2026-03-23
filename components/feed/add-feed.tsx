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
      {/* Entry Button View */}
      <TooltipProvider delayDuration={0}>
        <div className="flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-[28px] shadow-sm hover:shadow-md transition-all duration-300">
          <div
            onClick={showModal}
            className="flex-1 flex items-center gap-3 px-4 py-3 bg-zinc-50 border border-zinc-200/60 rounded-2xl cursor-pointer hover:bg-zinc-100 transition-all group lg:min-w-[480px]"
          >
            <UserAvatar
              size={34}
              src={data?.getEntity?.logo}
              className="rounded-xl shadow-sm border-2 border-white ring-1 ring-zinc-100"
            />
            <span className="text-[14px] font-medium text-zinc-400 group-hover:text-zinc-700 transition-colors">
              Start a post, or share a poll...
            </span>
          </div>

          <div className="flex items-center gap-1.5 pr-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-2xl text-blue-500 hover:bg-blue-50 transition-all active:scale-95"
                  onClick={() => {
                    showModal();
                    setShowPoll(false);
                  }}
                >
                  <ImageIcon className="h-5 w-5" strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-zinc-900 border-none font-bold text-[11px]"
              >
                Attach Media
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-2xl text-emerald-500 hover:bg-emerald-50 transition-all active:scale-95"
                  onClick={() => {
                    showModal();
                    setShowPoll(true);
                  }}
                >
                  <BarChart2 className="h-5 w-5" strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-zinc-900 border-none font-bold text-[11px]"
              >
                Create Poll
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden rounded-[40px] border-none shadow-2xl flex flex-col bg-white">
          {/* Header section */}
          <div className="bg-white border-b border-zinc-100 px-8 py-7 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-xl ring-1 ring-black/5">
                <MessageSquare
                  className="h-7 w-7 text-white"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h1 className="text-[24px] font-black text-zinc-900 tracking-tight leading-none mb-1.5">
                  Create Post
                </h1>
                <p className="text-[13px] text-zinc-400 font-medium tracking-tight">
                  Share updates, media, or polls with your community ecosystem
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                type="button"
                className="rounded-full px-7 h-12 font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                onClick={handlePost}
                disabled={!postText.trim() || addLoading}
                className="rounded-full px-10 h-12 font-black bg-zinc-900 hover:bg-zinc-800 text-white shadow-[0_12px_24px_-8px_rgba(0,0,0,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                {addLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
          <div className="flex-1 overflow-y-auto bg-[#fafafa]">
            <div className="max-w-4xl mx-auto px-8 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-12 space-y-8">
                  {/* Post Content */}
                  <Card className="border-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] rounded-[32px] overflow-hidden bg-white ring-1 ring-zinc-100">
                    <CardHeader className="bg-zinc-50/50 pb-5 border-b border-zinc-100/50">
                      <div className="flex items-center gap-4">
                        <UserAvatar
                          size={48}
                          src={data?.getEntity?.logo}
                          className="rounded-2xl border border-white shadow-md"
                        />
                        <div>
                          <CardTitle className="text-[17px] font-bold text-zinc-900 tracking-tight leading-none mb-1.5">
                            {data?.getEntity?.name || "Your Organization"}
                          </CardTitle>
                          <CardDescription className="text-[12px] font-medium text-zinc-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Visible to your community
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-7 pb-5 space-y-5 px-8">
                      <Textarea
                        placeholder="What's happening? Share a news update, a photo, or start a poll..."
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        className="min-h-[240px] resize-none text-[18px] leading-relaxed border-none bg-transparent focus-visible:ring-0 p-0 placeholder:text-zinc-300 tracking-tight"
                        maxLength={1000}
                      />

                      <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-100 to-transparent" />

                      <div className="flex items-center justify-between">
                        <TooltipProvider delayDuration={0}>
                          <div className="flex items-center gap-3">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "rounded-full px-5 h-10 gap-2.5 font-black text-[13px] transition-all",
                                    !showPoll && !pollId
                                      ? "text-blue-500 hover:bg-blue-50"
                                      : "text-zinc-400 opacity-50 cursor-not-allowed",
                                  )}
                                  disabled={showPoll || !!pollId}
                                >
                                  <ImageIcon
                                    className="h-4.5 w-4.5"
                                    strokeWidth={2.5}
                                  />
                                  Photo/Video
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="bottom"
                                className="bg-zinc-900 border-none font-bold text-[11px]"
                              >
                                Attach Images/Video
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "rounded-full px-5 h-10 gap-2.5 font-black text-[13px] transition-all",
                                    showPoll
                                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                      : fileList.length > 0
                                        ? "text-zinc-400 opacity-50 cursor-not-allowed"
                                        : "text-emerald-500 hover:bg-emerald-50",
                                  )}
                                  onClick={() => setShowPoll(!showPoll)}
                                  disabled={fileList.length > 0}
                                >
                                  <BarChart2
                                    className="h-4.5 w-4.5"
                                    strokeWidth={2.5}
                                  />
                                  {showPoll
                                    ? "Post with text only"
                                    : pollId
                                      ? "Poll Attached"
                                      : "Add Poll"}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="bottom"
                                className="bg-zinc-900 border-none font-bold text-[11px]"
                              >
                                Toggle Poll
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>

                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                              postText.length > 900
                                ? "text-orange-500"
                                : "text-zinc-300",
                            )}
                          >
                            {postText.length} / 1000
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* New Poll Component Integration */}
                  {showPoll && !pollId && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <Card className="border-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] rounded-[32px] overflow-hidden bg-white ring-1 ring-zinc-100">
                        <CardHeader className="bg-emerald-50/50 pb-5 border-b border-emerald-100/30 px-8">
                          <CardTitle className="text-[14px] font-black uppercase tracking-[0.15em] text-emerald-700">
                            Create Poll
                          </CardTitle>
                          <CardDescription className="text-[12px] font-medium text-emerald-600/70">
                            Design an interactive poll for your post
                          </CardDescription>
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
                    </div>
                  )}

                  {pollId && (
                    <Card className="border-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] rounded-[32px] overflow-hidden bg-emerald-50/30 border border-emerald-100 ring-1 ring-emerald-100/50">
                      <CardContent className="p-6 flex items-center justify-between px-8">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center border border-emerald-200 shadow-sm">
                            <BarChart2 className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-[15px] font-bold text-emerald-900 tracking-tight">
                              Poll successfully attached!
                            </p>
                            <p className="text-[12px] text-emerald-600/70 font-medium">
                              Your poll will be published with this post.
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full px-4 text-emerald-700 hover:bg-emerald-100 font-bold"
                          onClick={() => setPollId(null)}
                        >
                          Remove Poll
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Media Upload Section */}
                  {!showPoll && !pollId && (
                    <Card className="border-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] rounded-[32px] overflow-hidden bg-white ring-1 ring-zinc-100">
                      <CardHeader className="bg-zinc-50/50 pb-5 border-b border-zinc-100/50 flex flex-row items-center justify-between px-8">
                        <div>
                          <CardTitle className="text-[14px] font-black uppercase tracking-[0.15em] text-zinc-900">
                            Attachments
                          </CardTitle>
                          <CardDescription className="text-[12px] font-medium text-zinc-400 mt-1">
                            Add visuals to increase high engagement
                          </CardDescription>
                        </div>
                        <AddMedia
                          fileList={fileList}
                          setFileList={setFileList}
                        />
                      </CardHeader>
                      <CardContent className="pt-8 px-8 pb-8">
                        <AllMedia
                          fileList={fileList}
                          setFileList={setFileList}
                        />
                        {(!fileList || fileList.length === 0) && (
                          <div className="py-14 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[28px] bg-zinc-50/30">
                            <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center shadow-sm border border-zinc-100 mb-4">
                              <ImageIcon className="h-8 w-8 text-zinc-100" />
                            </div>
                            <p className="text-[14px] font-bold text-zinc-400 tracking-tight">
                              Your media will appear here
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
