"use client";

import React from "react";
import { PolarisFormLayout, PolarisTipCard } from "@/components/gamification/shared/polaris-form-ui";
import { AuthTextCard } from "../auth-text-card";
import { LiveSignupPreview } from "../live-signup-preview";
import { useMemberCustomization } from "../member-customization-context";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function AuthTextTabView() {
  const { formik, entityName } = useMemberCustomization();

  return (
    <PolarisFormLayout
      sidebar={
        <div className="space-y-4">
          <LiveSignupPreview config={formik.values} entityName={entityName} />

          <PolarisTipCard title="Copywriting & Conversion Strategy">
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                • <strong>Action Verbs Outperform:</strong> Specific submit labels like <em>&quot;Claim Your Spot&quot;</em> or <em>&quot;Enter Workspace&quot;</em> drive up to <strong>22% higher completion rates</strong> than generic &quot;Submit&quot;.
              </p>
              <p>
                • <strong>Concise Value Proposition:</strong> Keep descriptions under 120 characters so new members immediately grasp the primary benefit before typing.
              </p>
              <p>
                • <strong>Mobile Viewport Friendly:</strong> Short headlines prevent text wrapping on mobile devices, keeping the auth form compact above the fold.
              </p>
            </div>
          </PolarisTipCard>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h4 className="text-xs font-bold text-foreground">
                Tone Alignment Checklist
              </h4>
            </div>
            <ul className="space-y-1.5 text-[11px] text-muted-foreground">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Headline greets members with your authentic brand voice.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Action button sets clear expectations for what happens next.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Footer switcher makes switching between Login and Signup effortless.</span>
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <AuthTextCard
          authTexts={formik.values.authTexts}
          entityName={entityName}
          onChange={(updates) =>
            formik.setFieldValue("authTexts", {
              ...formik.values.authTexts,
              ...updates,
            })
          }
        />
      </div>
    </PolarisFormLayout>
  );
}
