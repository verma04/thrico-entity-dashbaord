import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleContainer } from "../modules/module-container";
import { ModuleHeader } from "../modules/module-header";
import * as LucideIcons from "lucide-react";

export const ProcessStepsRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const title = content.title || "How It Works";
  const description =
    content.description || "Follow these simple steps to get started";
  const steps = content.steps || [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your account in seconds",
      icon: "UserPlus",
    },
    {
      number: "02",
      title: "Setup",
      description: "Configure your preferences",
      icon: "Settings",
    },
    {
      number: "03",
      title: "Launch",
      description: "Start using our platform",
      icon: "Rocket",
    },
    {
      number: "04",
      title: "Succeed",
      description: "Achieve your goals with ease",
      icon: "Award",
    },
  ];

  // Card Steps Layout
  if (layout === "card-steps") {
    return (
      <ModuleContainer
        containerSettings={content.containerSettings}
        className="bg-white"
      >
        <ModuleHeader
          title={title}
          description={description}
          alignment="center"
        />

        <div
          className={cn(
            "mt-16 grid gap-8",
            isMobile ? "grid-cols-1" : "md:grid-cols-3"
          )}
        >
          {steps.map((step: any, index: number) => {
            const CardWrapper = step.url ? "a" : "div";
            return (
              <CardWrapper
                key={index}
                href={step.url}
                className="group p-8 rounded-4xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative"
              >
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    {step.number || index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <div className="h-1 w-12 bg-slate-200 group-hover:w-full group-hover:bg-blue-600 transition-all duration-500" />
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </ModuleContainer>
    );
  }

  // Horizontal Steps Layout
  if (layout === "horizontal-steps") {
    return (
      <ModuleContainer
        containerSettings={content.containerSettings}
        className="bg-white"
      >
        <ModuleHeader
          title={title}
          description={description}
          alignment="center"
        />

        <div className="mt-16 relative">
          {/* Connection Line */}
          {!isMobile && (
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-slate-100" />
          )}

          <div
            className={cn(
              "grid gap-12",
              isMobile ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {steps.map((step: any, index: number) => {
              const StepWrapper = step.url ? "a" : "div";
              return (
                <StepWrapper
                  key={index}
                  href={step.url}
                  className="relative group text-center block"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-4xl bg-slate-50 border border-slate-100 text-slate-900 mb-8 relative z-10 group-hover:bg-slate-900 group-hover:text-white group-hover:-translate-y-2 transition-all duration-500 shadow-sm">
                    <span className="text-2xl font-black">
                      {step.number || index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed max-w-[240px] mx-auto text-sm">
                    {step.description}
                  </p>

                  {/* Connector for mobile/tablet */}
                  {index !== steps.length - 1 && (
                    <div className="lg:hidden w-px h-12 bg-slate-100 mx-auto mt-6" />
                  )}
                </StepWrapper>
              );
            })}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Icon Steps Layout
  if (layout === "icon-steps") {
    return (
      <ModuleContainer
        containerSettings={content.containerSettings}
        className="bg-slate-900 text-white"
      >
        <ModuleHeader
          title={title}
          description={description}
          alignment="center"
          titleClassName="text-white"
          descriptionClassName="text-slate-400"
        />

        <div
          className={cn(
            "mt-20 grid gap-x-8 gap-y-16",
            isMobile ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {steps.map((step: any, index: number) => {
            const IconComponent =
              (LucideIcons as any)[step.icon || "Zap"] || LucideIcons.Zap;
            const StepWrapper = step.url ? "a" : "div";

            return (
              <StepWrapper
                key={index}
                href={step.url}
                className="relative group text-center lg:text-left block"
              >
                <div className="mb-8 relative inline-block lg:block">
                  <div className="w-20 h-20 rounded-4xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                    <IconComponent size={32} />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-black text-white shadow-xl">
                    {step.number || index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {step.description}
                </p>

                {index !== steps.length - 1 && !isMobile && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 h-px bg-white/10" />
                )}
              </StepWrapper>
            );
          })}
        </div>
      </ModuleContainer>
    );
  }

  // Vertical Steps Layout
  if (layout === "vertical-steps") {
    return (
      <ModuleContainer
        containerSettings={content.containerSettings}
        className="bg-slate-50"
      >
        <div
          className={cn(
            "max-w-5xl mx-auto flex gap-16 md:gap-24",
            isMobile ? "flex-col" : "flex-row"
          )}
        >
          <div className={cn(isMobile ? "w-full" : "md:w-1/3")}>
            <ModuleHeader title={title} description={description} />
            <div className="mt-8 p-8 rounded-3xl bg-slate-900 text-white">
              <h4 className="font-bold mb-2">
                {content.helpTitle || "Need help?"}
              </h4>
              <p className="text-slate-400 text-sm mb-6">
                {content.helpDescription ||
                  "Our experts are available 24/7 to guide you through the process."}
              </p>
              <a
                href={content.helpButtonUrl || "#"}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold transition-colors block text-center"
              >
                {content.helpButtonText || "Schedule a Call"}
              </a>
            </div>
          </div>

          <div
            className={cn(isMobile ? "w-full space-y-8" : "md:w-2/3 space-y-8")}
          >
            {steps.map((step: any, index: number) => {
              const StepInner = (
                <div key={index} className="flex gap-8 group">
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-900 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300 shadow-sm">
                      {step.number || index + 1}
                    </div>
                    {index !== steps.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 my-4" />
                    )}
                  </div>

                  <div className="pb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:translate-x-1 transition-transform inline-block">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );

              if (step.url) {
                return (
                  <a key={index} href={step.url} className="block group">
                    {StepInner}
                  </a>
                );
              }
              return StepInner;
            })}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Default Steps Layout
  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-slate-50"
    >
      <ModuleHeader
        title={title}
        description={description}
        alignment="center"
      />

      <div
        className={cn(
          "mt-16 grid gap-8",
          isMobile ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {steps.map((step: any, index: number) => {
          const StepWrapper = step.url ? "a" : "div";
          return (
            <StepWrapper
              key={index}
              href={step.url}
              className="flex gap-4 group"
            >
              <div className="shrink-0 text-3xl font-black text-blue-600/20 pt-1 group-hover:text-blue-600/40 transition-colors">
                {step.number || index + 1}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </StepWrapper>
          );
        })}
      </div>
    </ModuleContainer>
  );
};
