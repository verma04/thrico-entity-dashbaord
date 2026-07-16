"use client";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { FileText, ShieldAlert } from "lucide-react";

export default function PoliciesPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Platform Policies"
        description="Review terms of service, acceptable use guidelines, and platform regulatory standards."
        breadcrumb="Compliance & Trust"
        icon={FileText}
        badgeText="Governance"
        showLiveIndicator={false}
      />

      <div className="space-y-6">
        {/* Terms of Service */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center border border-border shrink-0">
                  <FileText className="h-4 w-4" />
               </div>
               <div>
                  <h3 className="text-[14px] font-semibold text-foreground tracking-tight">Terms of Service</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Last updated: December 30, 2025</p>
               </div>
             </div>
          </div>
          
          <div className="p-0">
            <div className="p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <h4 className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-2">
                 <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">01</span>
                 Acceptance of Terms
              </h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this platform's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </div>

            <div className="p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <h4 className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-2">
                 <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">02</span>
                 User Conduct
              </h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                You agree to use the platform only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, libelous, defamatory, obscene, scandalous, inflammatory, pornographic, or profane material or any material that could constitute or encourage conduct that would be considered a criminal offense, give rise to civil liability, or otherwise violate any law.
              </p>
            </div>

            <div className="p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <h4 className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-2">
                 <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">03</span>
                 Content Ownership
              </h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
                You retain all rights and ownership of your content. However, by uploading content to the platform, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the content in connection with providing the service. We claim no intellectual property rights over the material you provide to the service.
              </p>
            </div>
          </div>
        </div>

        {/* Acceptable Use Policy */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center border border-border shrink-0">
                  <ShieldAlert className="h-4 w-4" />
               </div>
               <div>
                  <h3 className="text-[14px] font-semibold text-foreground tracking-tight">Acceptable Use Policy</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Strict prohibition guidelines.</p>
               </div>
             </div>
          </div>
          
          <div className="p-5">
             <h4 className="text-[13px] font-semibold text-foreground mb-3">Prohibited Activities</h4>
             <ul className="list-disc pl-5 space-y-1.5 text-[12px] text-muted-foreground max-w-3xl marker:text-muted-foreground">
               <li>Spamming or sending unsolicited messages.</li>
               <li>Hosting or distributing malware or malicious code.</li>
               <li>Attempting to gain unauthorized access to the system or user accounts.</li>
               <li>Harassing, bullying, or intimidating other users.</li>
               <li>Impersonating any person or entity.</li>
             </ul>
          </div>
        </div>
      </div>
    </EcosystemWrapper>
  );
}
