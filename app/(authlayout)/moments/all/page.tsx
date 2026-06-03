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
import { MomentCard } from "@/components/moments/moment-card";
import { MomentPreviewDialog } from "@/components/moments/moment-preview-dialog";
import { MomentsEmptyState } from "@/components/moments/moments-empty-state";
import { MomentsLoadingState } from "@/components/moments/moments-loading-state";

function MomentsListPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const { deleteMoment } = useAdminDeleteMoment();

  const {
    data: momentsData,
    loading: momentsLoading,
    error: momentsError,
    refetch: refetchMoments,
  } = useGetAllMoments({
    pagination: { page: 1, limit: 100 }, // Fetch more for client-side search or handle server-side
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
        toast.success("Moment deleted successfully");
        refetchMoments();
      } else {
        toast.error("Failed to delete moment");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting");
    }
  };

  if (momentsError) {
    return (
      <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-3xl text-center">
        <p className="text-destructive font-bold">Failed to load moments</p>
        <p className="text-xs text-muted-foreground mt-1">
          {momentsError.message}
        </p>
      </div>
    );
  }

  return (
    <EcosystemWrapper>
      {momentsLoading ? (
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

      {/* Preview Modal */}
      <MomentPreviewDialog
        moment={selectedMoment}
        onClose={() => setSelectedMoment(null)}
      />
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(MomentsListPage, "MOMENTS", "canRead"),
  "moments"
);
