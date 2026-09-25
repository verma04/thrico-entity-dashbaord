"use client";

import React, { useState } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname, useRouter } from "next/navigation";
import {
  Info,
  MessageCircle,
  Users,
  Star,
  Settings,
  AlertTriangle,
  Activity,
  ShieldAlert,
  RotateCcw,
  Upload,
  Calendar,
  Eye,
  Globe,
  Lock,
} from "lucide-react";
import { getCommunityById } from "@/graphql/actions/group";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import moment from "moment";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

function CommunitiesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname?.split("/")[2];
  const basePath = `/communities/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "about"
      : pathname?.replace(`${basePath}/`, "").split("/")[0] || "about";

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, loading, refetch } = getCommunityById({
    variables: {
      input: {
        communityId: id,
      },
    },
    skip: !id,
  });

  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const community = data?.getCommunityById;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refetch) {
        await refetch();
      }
      window.dispatchEvent(new CustomEvent("refresh-community-view"));
      toast.success(`${singularName} refreshed`);
    } catch {
      toast.error("Failed to refresh community details");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleExportSummary = () => {
    if (!community) {
      toast.error("No community data available to export");
      return;
    }

    const summaryRow = [
      {
        id: community.id,
        title: community.title || "",
        tagline: community.tagline || "",
        description: community.description || "",
        privacy: community.privacy || "PUBLIC",
        communityType: community.communityType || "VIRTUAL",
        joiningTerms: community.joiningTerms || "OPEN",
        membersCount: community.numberOfUser || 0,
        postsCount: community.numberOfPost || 0,
        viewsCount: community.numberOfViews || 0,
        likesCount: community.numberOfLikes || 0,
        rulesCount: community.rules?.length || 0,
        createdAt: community.createdAt
          ? moment(Number(community.createdAt) || community.createdAt).format("YYYY-MM-DD")
          : "",
      },
    ];

    const csv = buildCsv(summaryRow, [
      { header: "Community ID", getValue: (r) => r.id },
      { header: "Title", getValue: (r) => r.title },
      { header: "Tagline", getValue: (r) => r.tagline },
      { header: "Description", getValue: (r) => r.description },
      { header: "Privacy", getValue: (r) => r.privacy },
      { header: "Type", getValue: (r) => r.communityType },
      { header: "Joining Terms", getValue: (r) => r.joiningTerms },
      { header: "Members", getValue: (r) => r.membersCount },
      { header: "Discussions", getValue: (r) => r.postsCount },
      { header: "Impressions/Views", getValue: (r) => r.viewsCount },
      { header: "Likes", getValue: (r) => r.likesCount },
      { header: "Rules Active", getValue: (r) => r.rulesCount },
      { header: "Created At", getValue: (r) => r.createdAt },
    ]);

    const filename = `community-${(community.title || "summary")
      .toLowerCase()
      .replace(/\s+/g, "-")}-${moment().format("YYYY-MM-DD")}`;
    downloadCsv(csv, filename);
    toast.success("Community overview exported successfully");
  };

  const tabItems: ManageTabItem[] = [
    { key: "about", label: "About", icon: Info },
    {
      key: "discussion",
      label: "Discussions",
      icon: MessageCircle,
      path: "discussion",
      count: community?.numberOfPost !== undefined ? community.numberOfPost : undefined,
    },
    {
      key: "members",
      label: "Members",
      icon: Users,
      count: community?.numberOfUser !== undefined ? community.numberOfUser : undefined,
    },
    { key: "rating", label: "Reviews & Ratings", icon: Star },
    {
      key: "rules",
      label: "Guidelines",
      icon: ShieldAlert,
      count: community?.rules?.length !== undefined ? community.rules.length : undefined,
    },
    { key: "settings", label: "Settings", icon: Settings },
    { key: "audit-log", label: "Audit Log", icon: Activity },
    { key: "reported-items", label: "Reported Items", icon: ShieldAlert },
    { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle, danger: true },
  ];

  const isPublic = community?.privacy === "PUBLIC";
  const privacyColor = isPublic ? "bg-emerald-500" : "bg-amber-500";

  const headerBadges = !loading && community ? (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge
        variant="outline"
        className={cn(
          "px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider rounded-md gap-1.5 border shadow-2xs",
          isPublic
            ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800"
            : "bg-amber-50/80 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800"
        )}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            isPublic ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
          )}
        />
        {isPublic ? (
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" /> Public
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3" /> Private
          </span>
        )}
      </Badge>

      {community.communityType && (
        <Badge
          variant="secondary"
          className="px-2 py-0.5 text-[10px] font-medium tracking-wide rounded-md text-muted-foreground border border-border/40 shadow-2xs"
        >
          {community.communityType === "VIRTUAL" ? "Virtual Community" : community.communityType}
        </Badge>
      )}

      {community.categories && community.categories.length > 0 && (
        <Badge
          variant="outline"
          className="px-2 py-0.5 text-[10px] font-medium rounded-md text-foreground/80 bg-background/50 border-border/60"
        >
          {community.categories[0]}
        </Badge>
      )}
    </div>
  ) : null;

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg border-border/60 shadow-2xs transition-all"
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Refresh details"
      >
        <RotateCcw
          className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")}
        />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleExportSummary}
        className="h-8 rounded-lg text-xs gap-1.5 font-medium border-border/60 shadow-2xs hover:bg-muted/70"
      >
        <Upload className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden sm:inline">Export</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/communities/${id}/settings`)}
        className="h-8 rounded-lg text-xs gap-1.5 font-medium border-border/60 shadow-2xs hover:bg-muted/70"
      >
        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden sm:inline">Settings</span>
      </Button>
    </div>
  );

  const subtitleNode =
    !loading && community ? (
      <div className="text-xs text-muted-foreground flex items-center gap-2.5 flex-wrap pt-0.5">
        <span className="flex items-center gap-1 font-medium text-foreground/80">
          <Users className="h-3 w-3 text-muted-foreground" />
          <strong className="font-semibold text-foreground">
            {community.numberOfUser ?? 0}
          </strong>{" "}
          members
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3 w-3 text-muted-foreground" />
          <strong className="font-semibold text-foreground">
            {community.numberOfPost ?? 0}
          </strong>{" "}
          posts
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-muted-foreground" />
          <strong className="font-semibold text-foreground">
            {community.numberOfViews ?? 0}
          </strong>{" "}
          views
        </span>
        {community.createdAt && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3 text-muted-foreground/70" />
              Est. {moment(Number(community.createdAt) || community.createdAt).format("MMM YYYY")}
            </span>
          </>
        )}
      </div>
    ) : null;

  return (
    <ManageItemLayout
      title={community?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}…`}
      coverImage={community?.cover}
      defaultIcon={Users}
      statusColor={privacyColor}
      badges={headerBadges}
      subtitle={subtitleNode}
      headerActions={headerActions}
      closeHref="/communities/all"
      basePath={basePath}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/communities/all" },
        { label: community?.title || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(
  CommunitiesLayout,
  "COMMUNITIES",
  "canRead",
);
