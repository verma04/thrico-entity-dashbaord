"use client";

import React, { useState } from "react";
import { useGetAllMoments, Moment } from "@/graphql/actions/moments";
import { MomentCard } from "@/components/moments/moment-card";
import { MomentPreviewDialog } from "@/components/moments/moment-preview-dialog";
import { MomentsEmptyState } from "@/components/moments/moments-empty-state";
import { MomentsLoadingState } from "@/components/moments/moments-loading-state";

export function MomentsTab({ userId }: { userId: string }) {
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);

  const {
    data: momentsData,
    loading: momentsLoading,
    error: momentsError,
  } = useGetAllMoments({
    pagination: { page: 1, limit: 100, userId },
  });

  const moments = momentsData?.getAllMoments?.data || [];

  if (momentsLoading) {
    return <MomentsLoadingState />;
  }

  if (momentsError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-sm">
        Error loading moments: {momentsError.message}
      </div>
    );
  }

  if (moments.length === 0) {
    return <MomentsEmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {moments.map((moment: any) => (
          <MomentCard
            key={moment.id}
            moment={moment}
            onClick={() => setSelectedMoment(moment)}
            onDelete={() => {}}
          />
        ))}
      </div>

      <MomentPreviewDialog
        moment={selectedMoment}
        isOpen={!!selectedMoment}
        onClose={() => setSelectedMoment(null)}
      />
    </>
  );
}
