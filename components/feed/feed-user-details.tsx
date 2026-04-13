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

  const isEntity = addedBy === "ENTITY";
  const displayName = isEntity ? data?.getEntity?.name : `${user?.firstName} ${user?.lastName}`;
  const displayAvatar = isEntity ? data?.getEntity?.logo : user?.avatar;
  const displayRole = isEntity ? "Community Management" : (user?.about?.currentPosition || "Community Member");

  return (
    <div className="flex items-center gap-3.5 w-full">
      <div className="relative shrink-0">
        <UserAvatar
          size={42}
          src={displayAvatar}
          className="rounded-xl border border-border shadow-sm bg-card"
        />
        {isEntity && (
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-background flex items-center justify-center">
             <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-0.5">
          <span className="font-bold text-[15px] text-foreground tracking-tight leading-none truncate">
            {displayName}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline text-muted-foreground/30 font-light select-none text-xs">•</span>
            <span className="text-[12px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">
              {moment(createdAt).fromNow(true)} ago
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[13px] text-muted-foreground font-medium truncate max-w-[180px]">
            {displayRole}
          </p>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/30 shrink-0" />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help flex items-center">
                  {privacy === "PUBLIC" ? (
                    <Globe className="h-3 w-3 text-muted-foreground/50 transition-colors hover:text-primary" />
                  ) : (
                    <Lock className="h-3 w-3 text-muted-foreground/50 transition-colors hover:text-amber-500" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] bg-zinc-900 border-none font-bold text-white uppercase tracking-widest px-2.5 py-1.5">
                {privacy === "PUBLIC" ? "Public Ecosystem Insight" : "Restricted Connection Data"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default FeedUserDetails;
