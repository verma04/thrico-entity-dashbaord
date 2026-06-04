"use client";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { Shield, ShieldAlert } from "lucide-react";

export default function PrivacyPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Privacy & Data Hub"
        description="Learn how we handle, process, and protect your organization's customer data."
        breadcrumb="Compliance & Trust"
        icon={Shield}
        badgeText="Privacy Control"
        showLiveIndicator={false}
      />

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center border border-border shrink-0">
                  <ShieldAlert className="h-4 w-4" />
               </div>
               <div>
                  <h3 className="text-[14px] font-semibold text-foreground tracking-tight">Data Collection & Usage</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Last updated: December 30, 2025</p>
               </div>
             </div>
          </div>
          
          <div className="p-0">
            <div className="p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <h4 className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-2">
                 <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">01</span>
                 Information We Collect
              </h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                We collect information that you provide directly to us when you use our services. This includes contact information such as name, email address, and phone number; account credentials; and payment information. We also automatically collect certain technical data when you visit our platform, including IP addresses, browser types, and device information.
              </p>
            </div>

            <div className="p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <h4 className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-2">
                 <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">02</span>
                 How We Use Your Data
              </h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                We use the collected data to provide, maintain, and improve our services. Specifically, we use it to process transactions, send necessary notifications, provide customer support, and detect fraud. We may also use aggregated, anonymized data for analytics to understand user behavior and enhance our platform's performance.
              </p>
            </div>

            <div className="p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <h4 className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-2">
                 <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">03</span>
                 Data Sharing & Third Parties
              </h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                We do not sell your personal data to third parties. We may share information with trusted service providers who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. Legal requirements may also compel us to disclose information to authorities.
              </p>
            </div>

            <div className="p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <h4 className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-2">
                 <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">04</span>
                 Your Rights
              </h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                You have the right to access, correct, or delete your personal data. You can manage your communication preferences and opt-out of marketing communications at any time. If you wish to exercise these rights, please contact our support team or use the tools provided in your account settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </EcosystemWrapper>
  );
}
