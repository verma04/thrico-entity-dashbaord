"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Star, Users, Share2, MapPin } from "lucide-react";
import { communityEntity } from "../ts-types";
import { communityEntity } from "../ts-types";
import Image from "next/image";
import { useModuleStore } from "@/store/useModuleStore";

export default function PhotographyCommunity({
  data,
}: {
  data: communityEntity;
}) {
  const singularName = useModuleStore((state) => state.communitySingularName);
  return (
    <div>
      {/* Banner Image */}
      <div className="relative h-[300px] bg-muted flex justify-center items-center">
        <Image
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${data?.cover}`}
          alt={`${singularName} cover`}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Card */}
      <Card className="mx-10 -mt-10 relative z-10">
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold">{data?.title}</h2>
            <Badge variant="secondary" className="gap-1">
              <Globe className="h-3 w-3" />
              {data?.privacy}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              4.8 (156)
            </Badge>
          </div>

          {/* Description */}
          <p className="text-base mt-4 mb-6">{data?.description}</p>

          {/* Stats and Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>12.5K members</span>
              </div>
              <span>1234 posts</span>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Global</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="lg" className="gap-2">
                <Users className="h-4 w-4" />
                Join
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Member Avatars */}
          <div className="flex items-center gap-2 mt-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Avatar key={i} className="border-2 border-background">
                  <AvatarFallback />
                </Avatar>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              +12.5K members
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
