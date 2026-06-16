"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  GET_COMMUNITY_BY_ID,
  GET_COMMUNITY_RATINGS,
} from "@/graphql/quries/group/approval";

import {
  Star,
  Users,
  Trophy,
  TrendingUp,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  Shield,
  MessageCircle,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityFeed from "@/components/feed/community-feed";
import { useModuleStore } from "@/store/useModuleStore";

export default function CommunityDashboard() {
  const singularName = useModuleStore((state) => state.communitySingularName);
  const { id } = useParams() as { id: string };

  const { data: communityData } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { input: { communityId: id } },
    skip: !id,
  });

  const { data: ratingData } = useQuery(GET_COMMUNITY_RATINGS, {
    variables: { communityId: id, limit: 1, offset: 0 },
    skip: !id,
  });

  const community = communityData?.getCommunityById;
  const ratingSummary = ratingData?.getCommunityRatings?.summary;
  const averageRating = ratingSummary?.averageRating || 0;
  const totalRatings = ratingSummary?.totalRatings || 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted",
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-6">
        <Tabs defaultValue="all-discussions" className="w-full">
          <TabsList className="mb-4 bg-background border border-border/40 rounded-xl p-1">
            <TabsTrigger value="all-discussions" className="rounded-lg">All Discussions</TabsTrigger>
            <TabsTrigger value="pending-discussions" className="rounded-lg">
              Pending Discussions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all-discussions" className="mt-0">
            <CommunityFeed communityId={id} status="APPROVED" />
          </TabsContent>
          <TabsContent value="pending-discussions" className="mt-0">
            <CommunityFeed communityId={id} status="PENDING" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar Statistics and Info */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 rounded-2xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">{singularName} Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="flex justify-between items-center text-sm group">
              <span className="text-muted-foreground flex items-center gap-2 font-medium">
                <MessageCircle className="h-4 w-4" />
                Total Posts
              </span>
              <span className="font-bold tabular-nums text-foreground">
                {community?.numberOfPost || 0}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2 font-medium">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Total Views
              </span>
              <span className="font-bold text-emerald-600 tabular-nums">
                {community?.numberOfViews || 0}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2 font-medium">
                <UserPlus className="h-4 w-4 text-blue-500" />
                Total Members
              </span>
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
              >
                {community?.numberOfUser || 0} Members
              </Badge>
            </div>
            <div className="pt-4 mt-2 border-t border-border/40 border-dashed">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2 font-medium text-sm">
                  <Star className="h-4 w-4 text-amber-500" />
                  Rating
                </span>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>{averageRating.toFixed(1)}</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 rounded-2xl bg-gradient-to-br from-card to-amber-50/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-4xl font-black tracking-tight text-foreground">
                  {averageRating.toFixed(1)}
                </span>
                <div className="mt-1.5">{renderStars(averageRating)}</div>
                <span className="text-[11px] text-muted-foreground mt-1.5 font-semibold uppercase tracking-wider">
                  ({totalRatings} verified ratings)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-100/50 font-semibold -mr-2 text-xs"
              >
                Rate {singularName}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 rounded-2xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-base font-semibold text-foreground">
                {singularName} Admins
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {community?.creator ? (
              <div className="flex items-center gap-3 group">
                <Avatar className="h-10 w-10 border border-border/40 ring-1 ring-black/[0.04]">
                  <AvatarImage src={community.creator.avatar || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                    {community.creator.firstName?.charAt(0)}
                    {community.creator.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-foreground mb-0.5">
                    {community.creator.firstName} {community.creator.lastName}
                  </span>
                  <Badge
                    variant="outline"
                    className="w-fit text-[10px] h-5 px-1.5 uppercase tracking-wider bg-orange-50 text-orange-700 border-orange-200"
                  >
                    Administrator
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground font-medium">
                No admins found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
