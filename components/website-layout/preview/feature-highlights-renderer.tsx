import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Check, Star, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ModuleContainer } from "../modules/module-container";
import { ModuleHeader } from "../modules/module-header";

// Helper function to render icon from icon name
const renderIcon = (iconName: string, className?: string) => {
  if (!iconName) return null;
  const IconComponent = (LucideIcons as any)[iconName];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

export const FeatureHighlightsRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const title = content.title || "Why Choose Us";
  const description =
    content.description ||
    "Discover what makes us the best choice for your needs";
  const features = content.features || [
    {
      title: "Lightning Fast",
      description:
        "Experience blazing fast performance that keeps your users engaged",
      icon: "Zap",
      highlight: true,
    },
    {
      title: "Secure & Reliable",
      description: "Bank-level security with 99.9% uptime guarantee",
      icon: "Lock",
      highlight: false,
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock support from our expert team",
      icon: "Headphones",
      highlight: false,
    },
    {
      title: "Easy Integration",
      description:
        "Seamlessly integrate with your existing workflow in minutes",
      icon: "Link",
      highlight: true,
    },
  ];

  // Grid Highlights Layout
  if (layout === "grid-highlights") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <ModuleHeader
          title={title}
          description={description}
          alignment="center"
        />
        <div
          className={cn(
            "mt-16 grid gap-8",
            isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
          )}
        >
          {features.map((feature: any, idx: number) => (
            <div
              key={idx}
              className={cn(
                "text-center p-6 rounded-lg transition-all",
                feature.highlight
                  ? "bg-primary/5 border-2 border-primary/20 scale-105"
                  : "bg-white border border-gray-200 hover:border-primary/30"
              )}
            >
              <div
                className={cn(
                  "w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all",
                  feature.highlight
                    ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
                    : "bg-primary/10 text-primary"
                )}
              >
                {renderIcon(feature.icon, "w-8 h-8")}
              </div>
              <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
              {feature.highlight && (
                <div className="mt-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                    Popular
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ModuleContainer>
    );
  }

  // List Highlights Layout
  if (layout === "list-highlights") {
    return (
      <ModuleContainer
        containerSettings={{
          ...content.containerSettings,
          background:
            content.containerSettings?.backgroundColor || "bg-slate-50",
        }}
      >
        <ModuleHeader
          title={title}
          description={description}
          alignment="center"
        />
        <div className="mt-16 space-y-6">
          {features.map((feature: any, idx: number) => (
            <div
              key={idx}
              className={cn(
                "bg-white rounded-lg p-6 flex gap-6 items-center transition-all",
                feature.highlight
                  ? "border-2 border-primary shadow-lg"
                  : "border border-gray-200 hover:shadow-md"
              )}
            >
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                    feature.highlight
                      ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-md"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {renderIcon(feature.icon, "w-7 h-7")}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  {feature.title}
                  {feature.highlight && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
              <div className="flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </ModuleContainer>
    );
  }

  // Cards Highlights Layout
  if (layout === "cards-highlights") {
    return (
      <ModuleContainer
        containerSettings={{
          ...content.containerSettings,
          background:
            content.containerSettings?.backgroundColor || "bg-slate-50",
        }}
      >
        <ModuleHeader
          title={title}
          description={description}
          alignment="center"
        />
        <div
          className={cn(
            "mt-16 grid gap-8 max-w-6xl mx-auto",
            isMobile ? "grid-cols-1" : "md:grid-cols-2"
          )}
        >
          {features.map((feature: any, idx: number) => (
            <div
              key={idx}
              className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute -right-4 -top-4 w-40 h-40 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
                  {renderIcon(feature.icon, "w-8 h-8")}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-8 max-w-md">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-primary font-bold cursor-pointer hover:gap-3 transition-all">
                  <span>Explore capabilities</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModuleContainer>
    );
  }

  // Icon Highlights Layout
  if (layout === "icon-highlights") {
    return (
      <ModuleContainer
        containerSettings={{
          ...content.containerSettings,
          background:
            content.containerSettings?.backgroundColor || "bg-slate-50",
        }}
      >
        <ModuleHeader
          title={title}
          description={description}
          alignment="center"
        />
        <div
          className={cn(
            "mt-16 grid gap-8",
            isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
          )}
        >
          {features.map((feature: any, idx: number) => (
            <div key={idx} className="text-center group">
              <div
                className={cn(
                  "w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                  feature.highlight
                    ? "bg-gradient-to-br from-primary via-primary to-primary/90 text-white shadow-xl shadow-primary/30"
                    : "bg-gradient-to-br from-primary/10 to-primary/5 text-primary border-2 border-transparent group-hover:border-primary/30"
                )}
              >
                {renderIcon(feature.icon, "w-9 h-9")}
              </div>
              <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
              {feature.highlight && (
                <div className="mt-4">
                  <Check className="w-5 h-5 text-primary mx-auto" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ModuleContainer>
    );
  }

  // Default Simple Highlights
  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      <ModuleHeader
        title={title}
        description={description}
        alignment="center"
      />
      <div
        className={cn(
          "mt-16 grid gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
        )}
      >
        {features.map((feature: any, idx: number) => (
          <div key={idx} className="text-center p-4 group">
            <div className="w-14 h-14 mx-auto mb-3 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              {renderIcon(feature.icon, "w-7 h-7")}
            </div>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </ModuleContainer>
  );
};
