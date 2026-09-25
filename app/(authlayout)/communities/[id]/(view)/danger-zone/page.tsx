"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { getCommunityById, deleteCommunity } from "@/graphql/actions/group";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Users,
  FileText,
  Heart,
  Eye,
  Loader2,
} from "lucide-react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";
import { ReusableDangerZone } from "@/components/shared/reusable-danger-zone";

function DangerZone() {
  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data, loading } = getCommunityById({
    variables: {
      input: { communityId: id },
    },
    skip: !id,
  });

  const community = data?.getCommunityById;

  const [delCommunity, { loading: deleting }] = deleteCommunity({
    onCompleted: () => {
      toast.success(`${singularName} deleted permanently`);
      router.push("/communities/all");
    },
    onError: (error: any) => {
      toast.error(
        error.message || `Failed to delete ${singularName.toLowerCase()}`
      );
    },
  });

  const handleDelete = () => {
    delCommunity({
      variables: { id },
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs">Loading safety parameters…</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="bg-card border border-border/80 rounded-xl p-12 text-center max-w-lg mx-auto shadow-2xs">
        <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-60" />
        <h3 className="text-base font-semibold">{singularName} Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">
          This {singularName.toLowerCase()} could not be loaded or was previously removed.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 h-8 text-xs font-semibold"
          onClick={() => router.push("/communities/all")}
        >
          Back to {moduleName}
        </Button>
      </div>
    );
  }

  return (
    <ReusableDangerZone
      entityName={singularName}
      entityTitle={community.title || `${singularName} #${id}`}
      entityId={id}
      onDelete={handleDelete}
      loading={deleting}
      holdTime={2000}
      requireTypeMatch={true}
      warningDescription={`Permanently destroy "${community.title}" and its entire history. All ${community.numberOfPost || 0} discussion threads, ${community.numberOfUser || 0} memberships, reactions, and audit entries will be purged from database shards.`}
      impactMetrics={[
        {
          label: "Memberships",
          value: community.numberOfUser || 0,
          icon: Users,
          description: "Will lose community access",
        },
        {
          label: "Discussions",
          value: community.numberOfPost || 0,
          icon: FileText,
          description: "Threads deleted permanently",
        },
        {
          label: "Reactions",
          value: community.numberOfLikes || 0,
          icon: Heart,
          description: "Likes & upvotes purged",
        },
        {
          label: "Impressions",
          value: community.numberOfViews || 0,
          icon: Eye,
          description: "Analytics history deleted",
        },
      ]}
    />
  );
}

export default withModulePermission(DangerZone, "COMMUNITIES", "canDelete");
