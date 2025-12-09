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
  const { data, loading } = useGetEntity();

  return (
    <div className="flex items-start gap-3 w-full">
      <UserAvatar
        size={48}
        src={addedBy === "USER" ? user?.avatar : data?.getEntity?.logo}
      />
      <div className="flex-1">
        <div className="font-semibold">
          {addedBy === "USER" && (
            <span>
              {user?.firstName} {user?.lastName}
            </span>
          )}
          {addedBy === "ENTITY" && <span>{data?.getEntity?.name}</span>}
        </div>
        <div className="text-sm text-muted-foreground">
          {user?.about?.currentPosition}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <span>{moment(createdAt).fromNow()}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {privacy === "PUBLIC" ? (
                  <Globe className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {privacy === "PUBLIC" ? "Public" : "Private"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default FeedUserDetails;
