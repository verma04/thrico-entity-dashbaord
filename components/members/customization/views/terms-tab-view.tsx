"use client";

import React from "react";
import { PolarisFormLayout, PolarisTipCard } from "@/components/gamification/shared/polaris-form-ui";
import { TermsConfigCard } from "../terms-config-card";
import { LiveSignupPreview } from "../live-signup-preview";
import { useMemberCustomization } from "../member-customization-context";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function TermsTabView() {
  const { formik, entityName, handleTermsUpdate } = useMemberCustomization();

  return (
    <PolarisFormLayout
      sidebar={
        <div className="space-y-4">
          <LiveSignupPreview config={formik.values} entityName={entityName} />

          <PolarisTipCard title="Legal Enforceability & Best Practices">
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                • <strong>Explicit Consent (Clickwrap):</strong> Requiring an active checkbox click is significantly more enforceable in court than passive &quot;by browsing you agree&quot; browsewrap disclaimers.
              </p>
              <p>
                • <strong>Readable Structure:</strong> Use headings (H2/H3) and short paragraphs so members can easily digest code of conduct and privacy terms on mobile devices.
              </p>
              <p>
                • <strong>Audit Trail:</strong> Any terms updates will apply immediately to new registrations without disturbing existing authenticated members.
              </p>
            </div>
          </PolarisTipCard>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-rose-500" />
              <h4 className="text-xs font-bold text-foreground">
                Terms Checklist
              </h4>
            </div>
            <ul className="space-y-1.5 text-[11px] text-muted-foreground">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Explicit checkbox required for signup completion.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>In-app modal prevents navigating away during registration.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Content styled cleanly with high-contrast text.</span>
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <TermsConfigCard
        termsConfig={formik.values.termsAndConditions}
        entityName={entityName}
        onChange={handleTermsUpdate}
      />
    </PolarisFormLayout>
  );
}
