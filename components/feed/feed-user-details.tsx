import type React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Globe, Lock } from "lucide-react";
import moment from "moment";

import type { FeedProps } from "./types";
import UserAvatar from "../layout/user-avatar";
import { useGetEntity } from "@/graphql/actions";

const FeedUserDetails: React.FC<FeedProps> = ({
  user,
  createdAt,
  privacy,
  addedBy,
}) => {
  const { data } = useGetEntity();

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative shrink-0">
        <UserAvatar
          size={44}
          src={addedBy === "USER" ? user?.avatar : data?.getEntity?.logo}
          className="rounded-xl border border-zinc-100 shadow-sm"
        />
        {addedBy === "ENTITY" && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[15px] text-zinc-900 tracking-tight leading-none truncate">
            {addedBy === "USER" ? (
              `${user?.firstName} ${user?.lastName}`
            ) : (
              data?.getEntity?.name
            )}
          </span>
          <span className="text-zinc-300 select-none">•</span>
          <span className="text-[12px] font-medium text-zinc-400">
            {moment(createdAt).fromNow(true)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-[13px] text-zinc-500 font-medium truncate max-w-[200px]">
            {user?.about?.currentPosition || "Community Member"}
          </p>
          <span className="w-1 h-1 rounded-full bg-zinc-300" />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  {privacy === "PUBLIC" ? (
                    <Globe className="h-3 w-3 text-zinc-400" />
                  ) : (
                    <Lock className="h-3 w-3 text-zinc-400" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-[10px] px-2 py-1 bg-zinc-900 border-zinc-800 text-white">
                {privacy === "PUBLIC" ? "Public Post" : "Shared with Connections"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default FeedUserDetails;
