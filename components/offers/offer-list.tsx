"use client";

import React, { useState } from "react";
import { Offer } from "@/types/offer-types";
import { useOfferStore } from "@/store/useOfferStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  Trash2,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

interface OfferListProps {
  onEdit: (offer: Offer) => void;
}

export const OfferList: React.FC<OfferListProps> = ({ onEdit }) => {
  const {
    getFilteredOffers,
    deleteOffer,
    toggleActive,
    toggleFeatured,
    toggleTrending,
    approveOffer,
    rejectOffer,
  } = useOfferStore();
  const offers = getFilteredOffers();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);

  const handleDeleteClick = (offer: Offer) => {
    setOfferToDelete(offer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (offerToDelete) {
      deleteOffer(offerToDelete.id);
      setDeleteDialogOpen(false);
      setOfferToDelete(null);
    }
  };

  const getStatusBadge = (status: Offer["status"]) => {
    const variants = {
      approved: { variant: "default" as const, label: "Approved" },
      pending: { variant: "secondary" as const, label: "Pending" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
      expired: { variant: "outline" as const, label: "Expired" },
    };
    return variants[status];
  };

  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No offers found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className="p-5 border rounded-lg bg-card hover:shadow-md transition">
            {/* Image */}
            {offer.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img src={offer.image} alt={offer.title} className="w-full h-40 object-cover" />
              </div>
            )}

            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg flex-1">{offer.title}</h3>
                <div className="flex gap-1">
                  {offer.isFeatured && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                  {offer.isTrending && <TrendingUp className="h-5 w-5 text-blue-500" />}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge {...getStatusBadge(offer.status)}>{getStatusBadge(offer.status).label}</Badge>
                <Badge variant="outline">{offer.source === "admin" ? "Admin" : "User"}</Badge>
                <Badge variant="outline">{offer.categoryName}</Badge>
                {offer.discount && <Badge variant="secondary">{offer.discount}</Badge>}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>

              {/* Details */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Valid: {format(new Date(offer.validFrom), "MMM d")} -{" "}
                  {format(new Date(offer.validTo), "MMM d, yyyy")}
                </p>
                {offer.code && (
                  <p className="font-mono bg-muted px-2 py-1 rounded inline-block">
                    Code: {offer.code}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t flex-wrap">
                <Switch
                  checked={offer.isActive}
                  onCheckedChange={() => toggleActive(offer.id)}
                  className="mr-auto"
                />

                {offer.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => approveOffer(offer.id)}
                      className="text-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rejectOffer(offer.id)}
                      className="text-red-600"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFeatured(offer.id)}
                  className={offer.isFeatured ? "text-yellow-500" : ""}
                >
                  <Star className={`h-4 w-4 ${offer.isFeatured ? "fill-current" : ""}`} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleTrending(offer.id)}
                  className={offer.isTrending ? "text-blue-500" : ""}
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" onClick={() => onEdit(offer)}>
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(offer)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {offer.website && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <a href={offer.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Offer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{offerToDelete?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
