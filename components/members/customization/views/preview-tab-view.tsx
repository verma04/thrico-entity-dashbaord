"use client";

import React from "react";
import { Eye } from "lucide-react";
import { LiveSignupPreview } from "../live-signup-preview";
import { useMemberCustomization } from "../member-customization-context";

export function PreviewTabView() {
  const { formik, entityName } = useMemberCustomization();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 space-y-4">
        <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
              Live Member Simulator
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This simulator mirrors the exact interactive registration dialog presented to members visiting your community on web and mobile. Test inputs, validation errors, and custom fields in real time.
          </p>
          <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-border/50">
            <div className="flex justify-between">
              <span>Authentication Mode:</span>
              <strong className="text-foreground">{formik.values.authMethod}</strong>
            </div>
            <div className="flex justify-between">
              <span>Custom Inputs:</span>
              <strong className="text-foreground">{formik.values.customFields.length} configured</strong>
            </div>
            <div className="flex justify-between">
              <span>Referrals:</span>
              <strong className="text-foreground">
                {formik.values.referral.enabled ? "Active" : "Disabled"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 flex justify-center">
        <div className="w-full max-w-md">
          <LiveSignupPreview config={formik.values} entityName={entityName} />
        </div>
      </div>
    </div>
  );
}
