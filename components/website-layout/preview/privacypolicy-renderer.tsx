import React, { useState } from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import { ModuleContainer } from "../modules/module-container";

interface PrivacyPolicyRendererProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

export const PrivacyPolicyRenderer = ({
  module,
  previewDevice = "desktop",
}: PrivacyPolicyRendererProps) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const [activeTab, setActiveTab] = useState(0);

  const sections = content.sections || [
    { title: "1. Introduction", content: "Welcome to our Privacy Policy. Your privacy is critically important to us." },
    { title: "2. Data Collection", content: "We collect information to provide better services to all our users." },
  ];

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      {/* 1. SIMPLE PRIVACY */}
      {layout === "simple-privacy" && (
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">{content.title || "Privacy Policy"}</h1>
              <p className="text-muted-foreground">Last updated: {content.lastUpdated || "Today"}</p>
            </div>
            
            <div className="space-y-8">
              {sections.map((section: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
                    <p>{section.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
      )}

      {/* 2. LEGAL DOCUMENT */}
      {layout === "legal-document" && (
          <div className={cn("grid gap-12", !isMobile && "grid-cols-[250px_1fr]")}>
            {/* Sidebar Navigation */}
            <div className={cn("space-y-6", isMobile && "hidden")}>
               <div className="sticky top-24 space-y-2 border-l pl-4">
                 <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 opacity-70">Contents</h3>
                 {sections.map((section: any, idx: number) => (
                   <a 
                     key={idx} 
                     href={`#section-${idx}`} 
                     className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                   >
                     {section.title}
                   </a>
                 ))}
               </div>
            </div>

            <div className="space-y-12">
               <div className="border-b pb-8">
                 <h1 className="text-4xl font-serif font-medium mb-4">{content.title || "Privacy Policy"}</h1>
                 <p className="text-sm font-mono opacity-60">Effective Date: {content.lastUpdated || "January 1, 2024"}</p>
               </div>

               <div className="space-y-12">
                  {sections.map((section: any, idx: number) => (
                    <div key={idx} id={`section-${idx}`} className="scroll-mt-32 space-y-4">
                      <h2 className="text-2xl font-serif">{section.title}</h2>
                      <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground/90 font-serif leading-relaxed">
                        <p>{section.content}</p>
                      </div>
                    </div>
                  ))}
               </div>
               
               <div className="border-t pt-8 mt-16 text-center text-sm text-muted-foreground">
                 <p>For any questions regarding this policy, please contact us.</p>
               </div>
            </div>
          </div>
        )}

        {/* 3. TABBED POLICY */}
        {layout === "tabbed-policy" && (
          <div className="space-y-12">
             <div className="text-center space-y-4 max-w-3xl mx-auto">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                 <DynamicIcon name="Shield" className="h-3 w-3" />
                 Legal Center
               </div>
               <h1 className="text-4xl md:text-5xl font-bold">{content.title || "Policy Hub"}</h1>
               <p className="text-muted-foreground text-lg">Transparent terms for your peace of mind.</p>
               <p className="text-sm opacity-60">Last updated: {content.lastUpdated || "Recently"}</p>
             </div>

             <div className={cn("bg-card border rounded-2xl overflow-hidden shadow-sm", !isMobile && "flex min-h-[600px]")}>
                {/* Tabs Sidebar */}
                <div className={cn("bg-muted/30 p-2 overflow-x-auto flex", !isMobile && "flex-col w-64 border-r overflow-visible")}>
                   {sections.map((section: any, idx: number) => (
                     <button
                       key={idx}
                       onClick={() => setActiveTab(idx)}
                       className={cn(
                         "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left whitespace-nowrap",
                         activeTab === idx 
                           ? "bg-white dark:bg-slate-800 shadow-sm text-primary" 
                           : "text-muted-foreground hover:bg-white/50 dark:hover:bg-slate-800/50"
                       )}
                     >
                       <span className={cn(
                         "h-6 w-6 rounded-md flex items-center justify-center text-xs border",
                         activeTab === idx ? "border-primary/20 bg-primary/10" : "border-transparent bg-muted"
                       )}>
                         {idx + 1}
                       </span>
                       {section.title.split('.')[1] || section.title /* Handle inconsistent usage of "1. Title" vs "Title" */} 
                     </button>
                   ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                  <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300" key={activeTab}>
                    <h2 className="text-3xl font-bold mb-6">{sections[activeTab].title}</h2>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="leading-8 text-muted-foreground">{sections[activeTab].content}</p>
                    </div>
                  </div>
                </div>
              </div>
           </div>
      )}
    </ModuleContainer>
  );
};
