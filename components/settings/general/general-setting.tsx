"use client";

import { useState, useEffect } from "react";
import { Store, Globe, Image as ImageIcon, CreditCard, ShieldCheck, RotateCcw, Activity, ArrowRight, Server, ImagePlus } from "lucide-react";
import BillingAddress from "./billing-address";
import { useGetEntity } from "@/graphql/actions";
import { EntityProfileCard } from "./entity-profile-card";
import { EntityLogoUpload } from "./entity-logo-upload";
import { FaviconUpload } from "./favicon-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";

export default function GeneralSettings() {
  const { data: entityData, loading: entityLoading, refetch } = useGetEntity();

  const [communityName, setCommunityName] = useState(
    entityData?.getEntity?.name || "My Page"
  );
  const [communityImage, setCommunityImage] = useState<string>("");
  const [faviconImage, setFaviconImage] = useState<string>("");

  useEffect(() => {
    if (entityData?.getEntity) {
      setCommunityName(entityData.getEntity.name || "My Page");
      setCommunityImage(
        entityData.getEntity.logo
          ? `https://cdn.thrico.network/${entityData.getEntity.logo}`
          : ""
      );
    }
  }, [entityData]);

  const handleNameUpdate = (newName: string) => {
    setCommunityName(newName);
  };

  const handleLogoUpdate = (newUrl: string) => {
    setCommunityImage(newUrl);
  };

  const handleFaviconUpdate = (newUrl: string) => {
    setFaviconImage(newUrl);
  };

  if (entityLoading) {
    return (
      <EcosystemWrapper anonymized-1="settings-loading">
        <EcosystemHeader
          title="Institutional Control"
          badgeText="System Foundation"
          description="Synchronizing core identity parameters with the global registry node."
          icon={Store}
        />
        <EcosystemActionBar shadow="none">
           <Skeleton className="h-9 w-48 rounded-lg" />
        </EcosystemActionBar>
        <EcosystemContainer className="space-y-6 pt-6">
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8 space-y-6">
                 <Skeleton className="h-[400px] w-full rounded-xl" />
                 <Skeleton className="h-[250px] w-full rounded-xl" />
              </div>
              <div className="xl:col-span-4 space-y-6">
                 <Skeleton className="h-[200px] w-full rounded-xl" />
              </div>
           </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper anonymized-1="general-settings">
      <EcosystemHeader
        title="Institutional Control"
        badgeText="Foundation Identity"
        description="Manage your community identity, branding assets, and institutional details for global identification across the network."
        icon={Store}
      />

      <EcosystemActionBar shadow="none" className="border-t-0 p-0 bg-transparent mb-6">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="text-[11px] font-semibold text-slate-700 tracking-tight">
                    Synchronized
                 </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                 <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                 <span>Registry Verified Node</span>
              </div>
           </div>

           <Button variant="outline" className="h-9 px-4 rounded-lg border-slate-200 font-semibold text-slate-700 text-[12px] shadow-sm bg-white hover:bg-slate-50 gap-2 transition-all" onClick={() => refetch()}>
             <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
             Sync Protocol
           </Button>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-6 pb-12 w-full max-w-[1400px]">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
           
           {/* Main Settings Area */}
           <div className="xl:col-span-8 space-y-6">
              {/* Identity Section */}
              <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col">
                 <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
                          <Store className="h-4 w-4" />
                       </div>
                       <div>
                          <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Foundational Identity</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">Core Institutional Parameters</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-6 space-y-8">
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                         <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                         <h4 className="text-[12px] font-semibold text-slate-900 tracking-tight">Profile Overview Registry</h4>
                      </div>
                      <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-sm">
                         <EntityProfileCard
                           name={communityName}
                           image={communityImage}
                           onNameUpdate={handleNameUpdate}
                         />
                      </div>
                    </section>

                    <div className="h-px w-full bg-slate-100" />

                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                         <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                         <h4 className="text-[12px] font-semibold text-slate-900 tracking-tight">Visual Asset Manifest</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors duration-300 group">
                          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700 mb-4">
                            <ImagePlus className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" /> 
                            Primary Logo
                          </div>
                          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
                            <EntityLogoUpload
                              currentImage={communityImage}
                              onImageUpdate={handleLogoUpdate}
                            />
                          </div>
                        </div>
                        <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors duration-300 group">
                          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700 mb-4">
                            <Globe className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" /> 
                            Browser Favicon
                          </div>
                          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
                            <FaviconUpload
                              currentImage={faviconImage}
                              onImageUpdate={handleFaviconUpdate}
                            />
                          </div>
                        </div>
                      </div>
                    </section>
                 </div>
              </div>

              {/* Institutional Section */}
              <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col">
                 <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                          <CreditCard className="h-4 w-4" />
                       </div>
                       <div>
                          <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Institutional Billing</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">Legal Registry & Invoicing Protocols</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-6">
                    <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 shadow-sm">
                       <BillingAddress />
                    </div>
                 </div>
              </div>
           </div>

           {/* Sidebar Info/Tips */}
           <div className="xl:col-span-4 space-y-6 sticky top-6">
              {/* Asset Guide Widget */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-900 shadow-lg text-white overflow-hidden relative group">
                 <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-700" />
                 
                 <div className="p-5 relative z-10 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center border border-white/10">
                          <ImageIcon className="h-3.5 w-3.5 text-indigo-300" />
                       </div>
                       <h4 className="text-[13px] font-semibold text-white tracking-tight">Asset Guidelines</h4>
                    </div>
                    
                    <p className="text-[12px] text-slate-300 leading-relaxed font-medium">
                       Ensure your primary logo utilizes a transparent background. High-resolution PNG or SVG is strictly required. Non-transparent background imagery will result in visual clipping across ecosystem endpoints.
                    </p>
                    
                    <div className="pt-2">
                       <Button variant="ghost" className="h-8 px-0 text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 hover:bg-transparent group/btn">
                          View Design Resources <ArrowRight className="h-3 w-3 ml-1.5 transition-transform group-hover/btn:translate-x-1" />
                       </Button>
                    </div>
                 </div>
              </div>

              {/* Status Widgets */}
              <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                 <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
                    <Activity className="h-3.5 w-3.5 text-slate-400" />
                    <h4 className="text-[12px] font-semibold text-slate-900 tracking-tight">System Propagation</h4>
                 </div>
                 <div className="p-5 space-y-5">
                    <div className="space-y-1.5">
                       <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center justify-between">
                         <span className="flex items-center gap-1.5">
                           <Server className="h-3 w-3 text-emerald-500" /> 
                           Global CDN
                         </span>
                         <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px]">ACTIVE</span>
                       </h5>
                       <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                          Changes to your institutional profile are broadcasted instantly across all synchronized edge node endpoints.
                       </p>
                    </div>

                    <div className="h-px w-full bg-slate-100" />

                    <div className="space-y-1.5">
                       <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center justify-between">
                         <span className="flex items-center gap-1.5">
                           <Globe className="h-3 w-3 text-slate-400" /> 
                           Registry Visibility
                         </span>
                       </h5>
                       <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                          Your entity configuration governs how peer nodes perceive your brand across the global registry index.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
           
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
