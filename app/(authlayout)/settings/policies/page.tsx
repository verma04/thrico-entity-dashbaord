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
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
                  <FileText className="h-4 w-4" />
               </div>
               <div>
                  <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Terms of Service</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Last updated: December 30, 2025</p>
               </div>
             </div>
          </div>
          
          <div className="p-0">
            <div className="p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
              <h4 className="text-[13px] font-semibold text-slate-900 mb-1.5 flex items-center gap-2">
                 <span className="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">01</span>
                 Acceptance of Terms
              </h4>
              <p className="text-[12px] text-slate-600 leading-relaxed max-w-3xl">
                By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this platform's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </div>

            <div className="p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
              <h4 className="text-[13px] font-semibold text-slate-900 mb-1.5 flex items-center gap-2">
                 <span className="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">02</span>
                 User Conduct
              </h4>
              <p className="text-[12px] text-slate-600 leading-relaxed max-w-3xl">
                You agree to use the platform only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, libelous, defamatory, obscene, scandalous, inflammatory, pornographic, or profane material or any material that could constitute or encourage conduct that would be considered a criminal offense, give rise to civil liability, or otherwise violate any law.
              </p>
            </div>

            <div className="p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
              <h4 className="text-[13px] font-semibold text-slate-900 mb-1.5 flex items-center gap-2">
                 <span className="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">03</span>
                 Content Ownership
              </h4>
              <p className="text-[12px] text-slate-600 leading-relaxed max-w-3xl">
                You retain all rights and ownership of your content. However, by uploading content to the platform, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the content in connection with providing the service. We claim no intellectual property rights over the material you provide to the service.
              </p>
            </div>
          </div>
        </div>

        {/* Acceptable Use Policy */}
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
                  <ShieldAlert className="h-4 w-4" />
               </div>
               <div>
                  <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Acceptable Use Policy</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Strict prohibition guidelines.</p>
               </div>
             </div>
          </div>
          
          <div className="p-5">
             <h4 className="text-[13px] font-semibold text-slate-900 mb-3">Prohibited Activities</h4>
             <ul className="list-disc pl-5 space-y-1.5 text-[12px] text-slate-600 max-w-3xl marker:text-slate-300">
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
