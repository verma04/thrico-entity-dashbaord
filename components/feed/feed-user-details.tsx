import type React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Globe, Lock, ShieldCheck } from "lucide-react";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

import type { FeedProps } from "./types";
import UserAvatar from "../layout/user-avatar";
import { useGetEntity } from "@/graphql/actions";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";

const FeedUserDetails: React.FC<FeedProps> = ({
  user,
  createdAt,
  privacy,
  addedBy,
}) => {
  const { data } = useGetEntity();

  const isEntity = addedBy === "ENTITY";
  const displayName = isEntity
    ? data?.getEntity?.name || "Community Management"
    : `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Community Member";
  const displayAvatar = isEntity ? data?.getEntity?.logo : user?.avatar;
  const displayRole = isEntity
    ? "Community Team"
    : user?.about?.currentPosition || "Member";

  const hoverData = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    avatar: user?.avatar,
    headline: user?.about?.currentPosition,
  };

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="relative shrink-0">
        {!isEntity && user?.id ? (
          <UserProfileHoverCard user={hoverData}>
            <div className="cursor-pointer transition-transform hover:scale-105">
              <UserAvatar
                size={42}
                src={displayAvatar}
                className="rounded-xl border border-border/80 shadow-xs bg-card"
              />
            </div>
          </UserProfileHoverCard>
        ) : (
          <div className="relative">
            <UserAvatar
              size={42}
              src={displayAvatar}
              className="rounded-xl border border-border/80 shadow-xs bg-card"
            />
            {isEntity && (
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-card flex items-center justify-center shadow-xs">
                <ShieldCheck className="h-2.5 w-2.5 text-primary-foreground" />
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {!isEntity && user?.id ? (
            <UserProfileHoverCard user={hoverData}>
              <span className="font-semibold text-sm text-foreground tracking-tight leading-none truncate cursor-pointer hover:text-primary transition-colors">
                {displayName}
              </span>
            </UserProfileHoverCard>
          ) : (
            <span className="font-semibold text-sm text-foreground tracking-tight leading-none truncate">
              {displayName}
            </span>
          )}

          {isEntity && (
            <Badge
              variant="outline"
              className="text-[10px] font-semibold px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20 leading-none"
            >
              Official
            </Badge>
          )}

          <span className="text-muted-foreground/40 text-xs select-none">•</span>
          <span className="text-xs text-muted-foreground font-normal leading-none">
            {moment(createdAt).fromNow()}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
          <span className="font-medium truncate max-w-[200px]">
            {displayRole}
          </span>
          <span className="text-muted-foreground/40 select-none">•</span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help flex items-center gap-1 text-muted-foreground/70 hover:text-foreground transition-colors">
                  {privacy === "PUBLIC" ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  <span className="text-[11px] capitalize">
                    {privacy === "PUBLIC" ? "Public" : "Restricted"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="text-xs bg-popover text-popover-foreground border border-border shadow-md px-2.5 py-1.5"
              >
                {privacy === "PUBLIC"
                  ? "Visible to all community members"
                  : "Visible to direct connections only"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default FeedUserDetails;

