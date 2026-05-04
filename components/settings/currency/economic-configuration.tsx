"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Palette, Zap, Info } from "lucide-react";
import { useState } from "react";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useUpdateEntityCurrencyConfig } from "@/graphql/actions";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";

interface EconomicConfigProps {
  data: any;
  loading: boolean;
}

const validationSchema = Yup.object().shape({
  currencyName: Yup.string().required("Currency Name is required"),
  normalizationFactor: Yup.number()
    .positive("Must be positive")
    .integer("Must be an integer")
    .required("Required"),
  tcCoinsAllowed: Yup.boolean(),
});

export function EconomicConfiguration({ data, loading }: EconomicConfigProps) {
  const [saved, setSaved] = useState(false);

  const [updateConfig, { loading: updating }] = useUpdateEntityCurrencyConfig({
    onCompleted: () => {
      toast.success("Economic configuration updated");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      formik.resetForm({ values: formik.values });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      currencyName: data?.getEntityCurrencyConfig?.currencyName || "",
      normalizationFactor:
        data?.getEntityCurrencyConfig?.normalizationFactor || 1,
      tcCoinsAllowed: data?.getEntityCurrencyConfig?.tcCoinsAllowed ?? true,
    },
    validationSchema,
    onSubmit: (values) => {
      updateConfig({
        variables: {
          input: {
            currencyName: values.currencyName,
            normalizationFactor: Number(values.normalizationFactor),
            tcCoinsAllowed: values.tcCoinsAllowed,
          },
        },
      });
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/60 border border-blue-100">
        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-blue-900">How this works</p>
          <p className="text-xs text-blue-800/80 leading-relaxed">
            Activity Points ÷ Normalization Factor = Entity Currency earned. For
            most entities, a factor of <strong>100</strong> is a stable starting
            point.
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Currency Name */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Palette className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Currency Name
              </p>
              <p className="text-xs text-muted-foreground">
                Your local currency's display name
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Name
            </Label>
            <Input
              id="currencyName"
              name="currencyName"
              placeholder="e.g. Credits, Gems, Stars"
              value={formik.values.currencyName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.currencyName && formik.errors.currencyName && (
              <p className="text-xs text-red-500 font-medium">
                {formik.errors.currencyName as string}
              </p>
            )}
          </div>
        </div>

        {/* Normalization Factor */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Normalization Factor
              </p>
              <p className="text-xs text-muted-foreground">
                Points ÷ Factor = {formik.values.currencyName || "EC"}
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Factor
            </Label>
            <Input
              id="normalizationFactor"
              name="normalizationFactor"
              type="number"
              className="font-mono font-semibold"
              value={formik.values.normalizationFactor}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.normalizationFactor && formik.errors.normalizationFactor && (
              <p className="text-xs text-red-500 font-medium">
                {formik.errors.normalizationFactor as string}
              </p>
            )}
          </div>
          <div className="px-3 py-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800">
            <span className="font-medium">Example: </span>
            100 pts ÷ {formik.values.normalizationFactor || 1} ={" "}
            <span className="font-bold">
              {(100 / (Number(formik.values.normalizationFactor) || 1)).toFixed(2)}{" "}
              {formik.values.currencyName || "EC"}
            </span>
          </div>
        </div>
      </div>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={updating}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
      />
    </div>
  );
}
