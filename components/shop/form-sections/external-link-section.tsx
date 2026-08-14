"use client";

import { useFormikContext } from "formik";
import { UTMGenerator } from "../utm-generator";
import { ProductFormValues } from "../product-form";
import { Label } from "@/components/ui/label";

interface ExternalLinkSectionProps {
  entityName: string;
}

export function ExternalLinkSection({ entityName }: ExternalLinkSectionProps) {
  const { values, setFieldValue, errors, touched, submitCount } =
    useFormikContext<ProductFormValues>();

  return (
    <div className="space-y-3">
      <UTMGenerator
        entityName={entityName}
        baseUrl={values.externalLink}
        onUrlChange={(url) => setFieldValue("externalLink", url)}
      />
      {(touched.externalLink || submitCount > 0) && errors.externalLink && (
        <p className="text-[11px] text-rose-500 font-medium mt-1">
          {errors.externalLink as string}
        </p>
      )}
    </div>
  );
}
