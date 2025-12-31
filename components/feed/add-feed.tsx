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
  MessageSquare,
  ChevronRight,
  Save,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

import AddMedia from "./media";
import AllMedia from "./all-media";

import { useGetEntity } from "@/graphql/actions";
import { useAddFeed } from "@/graphql/actions/feed";
import UserAvatar from "../layout/user-avatar";
import { cn } from "@/lib/utils";

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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPostText("");
    setFileList([]);
  };

  const handlePost = () => {
    add({
      variables: {
        input: {
          description: postText,
          media: fileList ? fileList.map((file) => file.originFileObj) : [],
        },
      },
    });
  };

  return (
    <div className="p-4">
      <Button onClick={showModal} className="gap-2">
        <MessageSquare className="h-4 w-4" />
        Create Post
      </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0 flex flex-col">
          {/* Header section - Sticky */}
          <div className="sticky top-0 z-30 bg-background border-b px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Create Post
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
                  <span>Feed</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>Create New Post</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  type="button"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handlePost}
                  disabled={!postText.trim() || addLoading}
                  className="shadow-sm border-primary/20"
                >
                  {addLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Posting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Post
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  {/* Author Info */}
                  <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <CardTitle className="text-xl">Posting As</CardTitle>
                      <CardDescription>
                        Your post will be visible to everyone on the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <UserAvatar size={56} src={data?.getEntity?.logo} />
                        <div>
                          <p className="font-semibold text-lg">
                            {data?.getEntity?.name || "Your Organization"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Anyone on platform
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Post Content */}
                  <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <CardTitle className="text-xl">Post Content</CardTitle>
                      <CardDescription>
                        Share your thoughts, updates, or announcements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-2">
                      <Textarea
                        placeholder="What do you want to talk about?"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        className="min-h-[200px] resize-none text-base"
                        maxLength={1000}
                      />
                      <p className="text-[11px] text-muted-foreground text-right italic">
                        {postText.length}/1000 characters
                      </p>
                    </CardContent>
                  </Card>

                  {/* Media Upload */}
                  <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <CardTitle className="text-xl">Media</CardTitle>
                      <CardDescription>
                        Add images or videos to your post
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <AllMedia fileList={fileList} setFileList={setFileList} />
                    </CardContent>
                  </Card>
                </div>

                {/* Live Preview Sidebar */}
                <div className="lg:col-span-4">
                  <div className="sticky top-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Post Preview</h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/5 text-green-600 border-green-500/20"
                      >
                        Live Preview
                      </Badge>
                    </div>

                    <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
                      <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                      <CardContent className="pt-6 space-y-6">
                        {/* Author Preview */}
                        <div className="flex items-center gap-3">
                          <UserAvatar size={40} src={data?.getEntity?.logo} />
                          <div>
                            <p className="font-semibold">
                              {data?.getEntity?.name || "Your Organization"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Just now
                            </p>
                          </div>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Content Preview */}
                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Content
                          </h5>
                          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {postText ||
                              "Your post content will appear here..."}
                          </p>
                        </div>

                        {/* Media Preview */}
                        {fileList && fileList.length > 0 && (
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                              Media ({fileList.length})
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                              {fileList.slice(0, 4).map((file, index) => (
                                <div
                                  key={file.uid}
                                  className="aspect-square rounded-lg bg-muted/50 border border-border flex items-center justify-center overflow-hidden"
                                >
                                  {file.url ? (
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                  )}
                                </div>
                              ))}
                            </div>
                            {fileList.length > 4 && (
                              <p className="text-xs text-muted-foreground mt-2">
                                +{fileList.length - 4} more
                              </p>
                            )}
                          </div>
                        )}

                        <Separator className="opacity-50" />

                        {/* Engagement Preview */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>👍 Like</span>
                          <span>💬 Comment</span>
                          <span>🔄 Share</span>
                        </div>

                        <p className="text-[10px] text-center text-muted-foreground italic">
                          Preview version - Final layout may vary slightly
                        </p>
                      </CardContent>
                    </Card>

                    <div className="p-4 rounded-xl bg-muted/30 border border-dashed border-border flex items-start gap-4">
                      <div className="mt-1 p-1 bg-primary/20 rounded-full">
                        <MessageSquare className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Keep your posts engaging and relevant to your audience.
                        Add media to increase engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
