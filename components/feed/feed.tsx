import { MoreVertical, Repeat2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import FeedUserDetails from "./feed-user-details";
import type { FeedProps } from "./types";
import Like from "./actions/like";
import Analytics from "./analytics";
import Comments from "./comment/comment";
// import Poll from "./poll";

export default function Feed({ feed }: { feed: FeedProps }) {
  return (
    <div className="w-full">
      <Card className="w-full rounded-lg border border-border shadow-sm">
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <FeedUserDetails {...feed} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save post</DropdownMenuItem>
                <DropdownMenuItem>Hide post</DropdownMenuItem>
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {feed?.source === "dashboard" && (
            <div className="mb-4">
              <p className="text-foreground">{feed?.description}</p>
            </div>
          )}

          {/* {feed?.source === "poll" && feed?.poll?.id && (
            <Poll id={feed?.poll?.id} />
          )} */}

          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{feed?.totalReactions} Likes</span>
              <span>•</span>
              <span>{feed?.totalComment} Comments</span>
              <span>•</span>
              <span>{feed?.totalReShare} Shares</span>
            </div>
            <Analytics />
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between">
            <Like item={feed} />
            <Comments id={feed.id} />
            <Button variant="ghost" size="sm">
              <Repeat2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
