"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Smile, FileText } from "lucide-react";

import AddMedia from "./media";

import AllMedia from "./all-media";

import { useGetEntity } from "@/graphql/actions";
import { useAddFeed } from "@/graphql/actions/feed";
import UserAvatar from "../layout/user-avatar";

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
      <Button onClick={showModal}>Create Post</Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-4 py-4">
            <UserAvatar size={56} src={data?.getEntity?.logo} />
            <div>
              <p className="font-semibold">{data?.getEntity?.name}</p>
              <p className="text-sm text-muted-foreground">
                Anyone on platform
              </p>
            </div>
          </div>

          <Textarea
            placeholder="What do you want to talk about?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="min-h-[120px] resize-none text-base"
            maxLength={1000}
          />

          <div className="text-xs text-muted-foreground">
            {postText.length}/1000
          </div>

          <Separator className="my-2" />

          <AllMedia fileList={fileList} setFileList={setFileList} />

          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipContent>Add emoji</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* <Button variant="ghost" size="sm">
                       <FileText className="h-4 w-4" /> 
                    </Button> */}
                  </TooltipTrigger>
                  <TooltipContent>Add Document</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Button
              onClick={handlePost}
              disabled={!postText.trim()}
              loading={addLoading}
              className="rounded-full px-6"
            >
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
