"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useState, useMemo } from "react";
import {
  useGetAllMoments,
  useAdminDeleteMoment,
  Moment,
} from "@/graphql/actions/moments";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { MomentCard } from "@/components/moments/moment-card";
import { MomentPreviewDialog } from "@/components/moments/moment-preview-dialog";
import { MomentsEmptyState } from "@/components/moments/moments-empty-state";
import { MomentsLoadingState } from "@/components/moments/moments-loading-state";
import { useModuleStore } from "@/store/useModuleStore";
import { PlaySquare, Plus } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import Link from "next/link";

function MomentsListPage() {
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const { deleteMoment } = useAdminDeleteMoment();

  const {
    data: momentsData,
    loading: momentsLoading,
    error: momentsError,
    refetch: refetchMoments,
  } = useGetAllMoments({
    pagination: { page: 1, limit: 100 },
  });

  const moments = momentsData?.getAllMoments?.data || [];

  const filteredMoments = useMemo(() => {
    if (!searchQuery) return moments;
    const q = searchQuery.toLowerCase();
    return moments.filter(
      (m) =>
        m.caption?.toLowerCase().includes(q) ||
        `${m.owner?.firstName} ${m.owner?.lastName}`.toLowerCase().includes(q),
    );
  }, [moments, searchQuery]);

  const handleDelete = async (id: string) => {
    try {
      const { data } = await deleteMoment({
        variables: { adminDeleteMomentId: id },
      });
      if (data?.adminDeleteMoment) {
        toast.success(`${singularName} deleted successfully`);
        refetchMoments();
      } else {
        toast.error(`Failed to delete ${singularName.toLowerCase()}`);
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting");
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText="Media"
        description={`Manage and view all ${moduleName.toLowerCase()}.`}
        icon={PlaySquare}
        breadcrumbs={[
          { label: moduleName, href: "/moments" },
          { label: "All" },
        ]}
      />

      <EcosystemActionBar>
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={`Search ${moduleName.toLowerCase()}…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Link href="/moments/create">
              <CtaButton className="gap-2 px-4 h-9">
                <Plus className="h-4 w-4" />
                Create
              </CtaButton>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredMoments.length > 0}>
            {filteredMoments.length} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        {momentsError ? (
          <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-3xl text-center">
            <p className="text-destructive font-bold">
              Failed to load {moduleName.toLowerCase()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {momentsError.message}
            </p>
          </div>
        ) : momentsLoading ? (
          <MomentsLoadingState />
        ) : filteredMoments.length === 0 ? (
          <MomentsEmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
            {filteredMoments.map((moment) => (
              <MomentCard
                key={moment?.id}
                moment={moment}
                onClick={() => setSelectedMoment(moment)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <MomentPreviewDialog
          moment={selectedMoment}
          onClose={() => setSelectedMoment(null)}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(MomentsListPage, "MOMENTS", "canRead"),
  "moments",
);
