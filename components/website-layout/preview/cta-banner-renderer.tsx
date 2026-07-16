import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { ModuleContainer } from "../modules/module-container";

export const CtaBannerRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  console.log(layout);

  const title = content.title || "Ready to Get Started?";
  const description =
    content.description ||
    content.subtitle ||
    "Join thousands of users already using our platform";
  const secondaryText = content.secondaryText || "No credit card required";
  const buttons = content.buttons || [];

  // Helper function to get button variant classes
  const getButtonClasses = (variant: string, isWhiteBackground = false) => {
    const baseClasses =
      "px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2";

    switch (variant) {
      case "primary":
        return isWhiteBackground
          ? `${baseClasses} bg-primary text-white hover:bg-primary/90`
          : `${baseClasses} bg-white text-primary hover:bg-gray-100`;
      case "secondary":
        return `${baseClasses} bg-secondary text-secondary-foreground hover:bg-secondary/90`;
      case "outline":
        return isWhiteBackground
          ? `${baseClasses} border-2 border-primary text-primary hover:bg-primary/10`
          : `${baseClasses} border-2 border-white text-white hover:bg-white/10`;
      case "ghost":
        return `${baseClasses} hover:bg-white/10`;
      default:
        return isWhiteBackground
          ? `${baseClasses} bg-primary text-white hover:bg-primary/90`
          : `${baseClasses} bg-white text-primary hover:bg-gray-100`;
    }
  };

  // Centered Banner
  if (layout === "centered-banner") {
    return (
      <ModuleContainer
        containerSettings={{
          ...content.containerSettings,
          background:
            content.containerSettings?.background ||
            content?.backgroundColor ||
            "bg-gradient-to-r from-primary to-primary/80",
        }}
        className="text-white"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl mb-8 opacity-90">{description}</p>

          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.slice(0, 2).map((button: any, index: number) => (
              <button
                key={index}
                className={getButtonClasses(button.variant || "primary", false)}
              >
                {button.text || "Get Started"}
                <ArrowRight className="h-5 w-5" />
              </button>
            ))}
          </div>

          <p className="text-sm mt-4 opacity-75">{secondaryText}</p>
        </div>
      </ModuleContainer>
    );
  }

  // Split CTA
  if (layout === "split-cta") {
    return (
      <ModuleContainer
        containerSettings={{
          ...content.containerSettings,
          background:
            content.containerSettings?.background ||
            content?.backgroundColor ||
            "bg-slate-50",
        }}
      >
        <div
          className={cn(
            "grid items-center gap-12",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}
        >
          <div>
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground mb-6">{description}</p>

            <div className="flex flex-wrap gap-3">
              {buttons.slice(0, 2).map((button: any, index: number) => (
                <button
                  key={index}
                  className={getButtonClasses(
                    button.variant || "primary",
                    true
                  )}
                >
                  {button.text || "Get Started"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Image or Placeholder */}
          {content.image ? (
            <div className="rounded-2xl overflow-hidden h-64 md:h-80">
              <img
                src={content.image}
                alt="CTA Visual"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl h-64 md:h-80 flex items-center justify-center">
              <Zap className="h-24 w-24 text-primary/20" />
            </div>
          )}
        </div>
      </ModuleContainer>
    );
  }

  // Full-Width Highlight
  if (layout === "full-width-highlight") {
    return (
      <ModuleContainer
        containerSettings={{
          ...content.containerSettings,
          background:
            content.containerSettings?.background ||
            content?.backgroundColor ||
            "bg-black",
        }}
        className="text-white"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl mb-8 opacity-80">{description}</p>

          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.slice(0, 2).map((button: any, index: number) => (
              <button
                key={index}
                className={getButtonClasses(button.variant || "primary", false)}
              >
                {button.text || "Get Started"}
              </button>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Minimal CTA
  if (layout === "minimal-cta") {
    return (
      <ModuleContainer
        containerSettings={{
          ...content.containerSettings,
          background:
            content.containerSettings?.background ||
            content?.backgroundColor ||
            "bg-muted/30",
        }}
        className="border-y"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {buttons.slice(0, 2).map((button: any, index: number) => (
              <button
                key={index}
                className={getButtonClasses(button.variant || "primary", true)}
              >
                {button.text || "Get Started"}
              </button>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Urgency CTA
  if (layout === "urgency-cta") {
    return (
      <ModuleContainer
        containerSettings={{
          ...content.containerSettings,
          background:
            content.containerSettings?.background ||
            content?.backgroundColor ||
            "bg-rose-600",
        }}
        className="text-white"
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-semibold">Limited Time Offer</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl mb-8 opacity-90">{description}</p>

          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.slice(0, 2).map((button: any, index: number) => (
              <button
                key={index}
                className={getButtonClasses(button.variant || "primary", false)}
              >
                {button.text || "Get Started"}
                <ArrowRight className="h-5 w-5" />
              </button>
            ))}
          </div>

          <p className="text-sm mt-4 font-medium">Offer ends in 48 hours!</p>
        </div>
      </ModuleContainer>
    );
  }

  return <>{layout}</>;
};
