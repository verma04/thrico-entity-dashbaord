"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { getCommunityById, deleteCommunity } from "@/graphql/actions/group";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertTriangle,
  Users,
  FileText,
  Heart,
  Eye,
  Loader2,
  Trash2,
} from "lucide-react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

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
      toast.error(error.message || `Failed to delete ${singularName.toLowerCase()}`);
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
          <p className="text-xs">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center max-w-lg mx-auto">
        <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-60" />
        <h3 className="text-base font-semibold">{singularName} Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">
          This {singularName.toLowerCase()} could not be loaded or was previously removed.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push("/communities/all")}>
          Back to {moduleName}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Danger Zone
            </h2>
            <Badge variant="destructive" className="text-[10px] uppercase tracking-wider px-1.5 py-0">
              Irreversible
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Destructive actions and permanent deletion for &ldquo;{community.title}&rdquo;.
          </p>
        </div>

        <Badge variant="outline" className="text-xs text-muted-foreground py-1 px-2.5 shrink-0 self-start sm:self-auto">
          Status: <span className="font-semibold text-foreground ml-1">{community.privacy || "PUBLIC"}</span>
        </Badge>
      </div>

      {/* Impact Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border/80 rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" /> Members
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground mt-1 block tabular-nums">
            {community.numberOfUser || 0}
          </span>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Posts
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground mt-1 block tabular-nums">
            {community.numberOfPost || 0}
          </span>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-muted-foreground" /> Likes
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground mt-1 block tabular-nums">
            {community.numberOfLikes || 0}
          </span>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" /> Views
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground mt-1 block tabular-nums">
            {community.numberOfViews || 0}
          </span>
        </div>
      </div>

      {/* Main Destruction Card */}
      <div className="bg-card border border-destructive/20 rounded-xl shadow-sm overflow-hidden p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-destructive/[0.02] transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            <h4 className="text-sm font-semibold text-destructive">Delete this {singularName}</h4>
          </div>
          <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
            Permanently delete &ldquo;{community.title}&rdquo;, removing all members, posts, likes, comments, and settings. This cannot be recovered.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs shrink-0 self-start sm:self-auto h-8 shadow-sm gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete {singularName}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-destructive mb-1">
                <AlertTriangle className="h-5 w-5" />
                <AlertDialogTitle className="text-base font-semibold">
                  Delete {community.title}?
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
                This action cannot be undone. This will permanently delete the{" "}
                <strong className="text-foreground font-semibold">{community.title}</strong> {singularName.toLowerCase()}{" "}
                along with all {community.numberOfPost || 0} posts and {community.numberOfUser || 0} memberships.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel disabled={deleting} className="h-8 text-xs">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={deleting}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-8 text-xs shadow-sm"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
                Confirm Deletion
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default withModulePermission(DangerZone, "COMMUNITIES", "canDelete");
