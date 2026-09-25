"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOfferById, useDeleteOffer } from "@/graphql/actions/offers";
import { toast } from "sonner";
import { Loader2, Ticket, Eye } from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { ReusableDangerZone } from "@/components/shared/reusable-danger-zone";

function OfferDangerZonePage() {
  const singularName = useModuleStore((state) => state.offerSingularName) || "Offer";
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data, loading } = useGetOfferById(id, {
    skip: !id,
  });

  const offer = data?.getOfferById;

  const [deleteOffer, { loading: isDeleting }] = useDeleteOffer({
    onCompleted: () => {
      toast.success(`${singularName} deleted permanently`);
      router.push("/offers/all");
    },
    onError: (error: any) => {
      toast.error(error.message || `Failed to delete ${singularName.toLowerCase()}`);
    },
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading {singularName.toLowerCase()} details...</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteOffer({ variables: { id } });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <ReusableDangerZone
        entityName={singularName}
        entityTitle={offer?.title || "Untitled Offer"}
        impactMetrics={[
          {
            label: "Total Redemptions",
            value: offer?.claimsCount ?? 0,
            icon: Ticket,
          },
          {
            label: "Page Impressions",
            value: offer?.viewsCount ?? 0,
            icon: Eye,
          },
        ]}
        onDelete={handleDelete}
        loading={isDeleting}
        deleteButtonLabel={`Hold 2s to Delete ${singularName}`}
        deleteDoneLabel="Deleted"
        holdTime={2000}
        requireTypeMatch={false}
      />
    </div>
  );
}

export default withModulePermission(OfferDangerZonePage, "OFFERS", "canDelete");
