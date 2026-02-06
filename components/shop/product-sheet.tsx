import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ProductCreationForm } from "./product-creation-form";
import { ProductFormValues } from "./product-form";

interface ProductSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: ProductFormValues;
  loading: boolean;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  categories: { id: string; name: string }[];
  entityName: string;
  mode?: "create" | "edit";
}

export function ProductSheet({
  isOpen,
  onClose,
  initialValues,
  loading,
  onSubmit,
  categories,
  entityName,
  mode = "create",
}: ProductSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="top"
        className="h-[100dvh] w-screen p-0 border-none outline-none dark:bg-zinc-950"
      >
        <div className="h-full flex flex-col pt-2 min-h-0">
          {/* Pull Handle */}
          <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-4 shrink-0" />

          <div className="flex-1 min-h-0">
            <ProductCreationForm
              initialValues={initialValues}
              loading={loading}
              onFinish={onSubmit}
              onCancel={onClose}
              categories={categories}
              entityName={entityName}
              mode={mode}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
