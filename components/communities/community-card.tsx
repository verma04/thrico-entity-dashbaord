"use client";

import { communityEntity } from "./ts-types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MessageSquare, Eye as EyeIcon } from "lucide-react";
import moment from "moment";
import Actions from "./Actions";
import { getStatusTag, getVerificationTag } from "../discussion-forum/utils";

interface CommunityCardProps {
  record: communityEntity;
}

export default function CommunityCard({ record }: CommunityCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        {record.cover ? (
          <img
            src={`https://cdn.thrico.network/${record.cover}`}
            alt={record.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
            <span className="text-4xl font-bold text-primary/20">
              {record.title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Actions {...record} />
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold leading-none tracking-tight">
                {record.title}
              </h3>
              {getVerificationTag(record.verification?.isVerified || false)}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {record.tagline}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {record.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{record.numberOfUser || 0} Members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{record.numberOfPost || 0} Posts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <EyeIcon className="h-3.5 w-3.5" />
            <span>{record.numberOfViews || 0} Views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Joined {moment(record.createdAt).format("MMM YYYY")}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4 py-3 bg-muted/20">
        <div className="flex items-center gap-2">
          {getStatusTag(record.status)}
        </div>
        <div className="text-xs text-muted-foreground">
          Updated {moment(record.updatedAt).fromNow()}
        </div>
      </CardFooter>
    </Card>
  );
}
