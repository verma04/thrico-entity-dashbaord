import React, { useState } from "react";
import { useFormikContext } from "formik";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { VariantManager } from "../variant-manager";
import { useShopStore } from "@/store/useShopStore";
import { ProductFormValues } from "../product-form";

interface VariantsSectionProps {
  onSave?: () => Promise<void>;
  mode?: "create" | "edit";
  showOnly?: "options" | "table" | "all";
  onTabChange?: (tab: string) => void;
}

export function VariantsSection({
  onSave,
  mode,
  showOnly = "all",
  onTabChange,
}: VariantsSectionProps) {
  const { values } = useFormikContext<ProductFormValues>();
  const { hasVariants, setHasVariants } = useShopStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Variants</CardTitle>
          <CardDescription>Add size, color, or other options</CardDescription>
        </div>
        <Button
          type="button"
          variant={hasVariants ? "secondary" : "outline"}
          size="sm"
          onClick={() => setHasVariants(!hasVariants)}
        >
          {hasVariants ? "Disable Variants" : "Enable Variants"}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {!hasVariants ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Enable variants to add multiple options for this product.
          </div>
        ) : (
          <div className="space-y-6">
            <VariantManager
              basePrice={values.price || "0"}
              baseLink={values.externalLink}
              showOnly={showOnly}
              onTabChange={onTabChange}
            />

            {mode === "edit" && onSave && (
              <div className="flex justify-end pt-4 border-t">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save All Variants
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
