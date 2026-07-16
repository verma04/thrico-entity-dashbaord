"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOfferById, useDeleteOffer } from "@/graphql/actions/offers";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

export default function OfferDangerZonePage() {
  const singularName = useModuleStore((state) => state.offerSingularName);
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const { data, loading } = useGetOfferById(id, {
    skip: !id,
  });
  
  const offer = data?.getOfferById;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [deleteOffer, { loading: isDeleting }] = useDeleteOffer({
    onCompleted: () => {
      toast({
        title: "Success",
        description: `${singularName} deleted successfully`,
      });
      router.push("/offers/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to delete ${singularName.toLowerCase()}`,
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
    },
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleDelete = () => {
    deleteOffer({ variables: { id } });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <Card className="border-destructive/20 shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden bg-gradient-to-br from-card to-destructive/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-destructive text-lg">Danger Zone</CardTitle>
              <CardDescription className="mt-1">
                Irreversible and destructive actions for this {singularName.toLowerCase()}.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-card">
            <div>
              <h4 className="font-semibold text-foreground">Delete {singularName}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Once you delete an {singularName.toLowerCase()}, there is no going back. Please be certain.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="ml-4 whitespace-nowrap"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {singularName}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to permanently delete the {singularName.toLowerCase()}{" "}
              <span className="font-semibold text-foreground">
                "{offer?.title}"
              </span>
              ? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, delete " + singularName.toLowerCase()
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
