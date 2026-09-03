"use client";

import React, { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UnlayerEmailEditor } from "@/components/email/unlayer-editor";
import { useGetEmailTemplate } from "@/graphql/actions/email";

import { STARTER_TEMPLATES } from "@/lib/email-templates";
import { RefreshCw } from "lucide-react";

import { TemplateChooser } from "@/components/email/template-chooser/template-chooser";
import { STARTER_KEY_MAP } from "@/components/email/template-chooser/template-data";

// ─── Page entry point ─────────────────────────────────────────────────────────
function CreateTemplateContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  const [chosenStarter, setChosenStarter] = useState<string | null>(
    id || type ? (type ?? "blank") : null,
  );

  const { data, loading } = useGetEmailTemplate(id || "");

  const initialData = useMemo(() => {
    if (id && data?.getEmailTemplate) return data.getEmailTemplate;
    const starterKey = chosenStarter ?? type;
    if (starterKey && starterKey !== "blank") {
      const mappedKey =
        STARTER_KEY_MAP[starterKey] ??
        (starterKey.toUpperCase() as keyof typeof STARTER_TEMPLATES);
      const starter = STARTER_TEMPLATES[mappedKey];
      if (starter) {
        return {
          id: "",
          name: starter.name,
          subject: starter.subject,
          json: JSON.stringify(starter.blocks),
          html: "",
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return undefined;
  }, [id, data, type, chosenStarter]);

  if (id && loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#f8f9fb]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw
            className="h-7 w-7 text-indigo-500 animate-spin"
            strokeWidth={1.5}
          />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">
            Loading template…
          </p>
        </div>
      </div>
    );
  }

  if (!id && !chosenStarter) {
    return <TemplateChooser onSelect={setChosenStarter} />;
  }

  return <UnlayerEmailEditor id={id || undefined} initialData={initialData} />;
}

export default function CreateTemplatePage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center bg-[#f8f9fb]">
          <RefreshCw
            className="h-7 w-7 text-indigo-500 animate-spin"
            strokeWidth={1.5}
          />
        </div>
      }
    >
      <CreateTemplateContent />
    </Suspense>
  );
}
