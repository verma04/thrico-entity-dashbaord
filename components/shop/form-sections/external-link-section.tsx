"use client";

import { useFormikContext } from "formik";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UTMGenerator } from "../utm-generator";
import { ProductFormValues } from "../product-form";

interface ExternalLinkSectionProps {
  entityName: string;
}

export function ExternalLinkSection({ entityName }: ExternalLinkSectionProps) {
  const { values, setFieldValue, errors, touched, submitCount } =
    useFormikContext<ProductFormValues>();

  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-xl">External Link</CardTitle>
        <CardDescription>
          Link to a 3rd party site (Generates tracked UTM link)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <UTMGenerator
          entityName={entityName}
          baseUrl={values.externalLink}
          onUrlChange={(url) => setFieldValue("externalLink", url)}
        />
        {(touched.externalLink || submitCount > 0) && errors.externalLink && (
          <p className="text-xs text-destructive mt-2">
            {errors.externalLink as string}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
