"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useShopProduct, useDeleteShopProduct } from "@/graphql/actions/shop";
import { toast } from "sonner";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

function ShopDangerZonePage() {
  const singularName = useModuleStore((state) => state.shopSingularName);
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, loading: fetchingProduct } = useShopProduct(id);
  const product = data?.getShopProduct;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [deleteProduct, { loading: isDeleting }] = useDeleteShopProduct({
    onCompleted: () => {
      toast.success(`${singularName} deleted successfully`);
      router.push("/shop/all");
    },
    onError: (err) => {
      toast.error(err.message || `Failed to delete ${singularName.toLowerCase()}`);
    },
  });

  if (fetchingProduct) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return <div>{singularName} not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-destructive flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Danger Zone
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Destructive actions to manage this {singularName.toLowerCase()}. Proceed with caution.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete {singularName}
            </CardTitle>
            <CardDescription>
              Permanently delete this {singularName.toLowerCase()} and all its associated variants. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                `Delete ${singularName}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent className="rounded-2xl border-slate-200/60 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-xl text-slate-900">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-slate-500">
              This will permanently delete the {singularName.toLowerCase()} <strong>{product.title}</strong> and all its variants.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProduct({ variables: { id: product.id } })}
              className="rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-none gap-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withModulePermission(ShopDangerZonePage, "SHOP", "canDelete");
