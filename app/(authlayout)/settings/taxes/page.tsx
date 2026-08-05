"use client";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { ReceiptCent, Globe, ShieldAlert } from "lucide-react";

export default function TaxesPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Taxes & Duties"
        description="Information regarding tax regulations, compliance, and import duties."
        breadcrumb="Financial Operations"
        icon={ReceiptCent}
        badgeText="Compliance"
        showLiveIndicator={false}
      />

      <EcosystemWrapper className="m-4">
        <div className="space-y-6">
          {/* Tax Compliance */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/50 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center border border-border shrink-0">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground tracking-tight">
                  Tax Compliance
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Understanding your tax obligations globally.
                </p>
              </div>
            </div>

            <div className="p-0">
              <div className="p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <h4 className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                    01
                  </span>
                  Digital Services Tax
                </h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                  We are required to collect and remit digital services tax in
                  certain jurisdictions. The applicable tax rate matches the
                  standard VAT/GST rate in your country of residence. This tax
                  is automatically calculated and added to your monthly
                  subscription invoice where applicable.
                </p>
              </div>

              <div className="p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <h4 className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                    02
                  </span>
                  Sales Tax / VAT
                </h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                  If you are a business customer registered for VAT/GST, you may
                  be eligible to receive invoices without tax charged, subject
                  to the reverse charge mechanism. Please ensure your business
                  details and tax identification number are correctly entered in
                  your billing settings to facilitate this.
                </p>
              </div>

              <div className="p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <h4 className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                    03
                  </span>
                  Withholding Tax
                </h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                  In some cases, you may be required by local law to withhold
                  tax from payments made to us. If this applies, you must
                  provide us with an official withholding tax certificate.
                  Please contact our billing support team for assistance with
                  processing withholding tax documentation and adjustments.
                </p>
              </div>
            </div>
          </div>

          {/* Duties & Import Fees */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/50 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center border border-border shrink-0">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground tracking-tight">
                  Duties & Import Fees
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Physical goods and cross-border distribution.
                </p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                For any physical goods or merchandise purchased or distributed
                through the platform, the recipient is generally responsible for
                all import duties, customs fees, and local sales taxes levied by
                the destination country. We are not responsible for delays
                caused by customs clearance processes.
              </p>
            </div>
          </div>
        </div>
      </EcosystemWrapper>
    </EcosystemWrapper>
  );
}
