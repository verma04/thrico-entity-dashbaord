import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleContainer } from "../modules/module-container";

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
      title: "Sign Up",
      description: "Create your account in seconds",
      icon: "1",
    },
    { title: "Setup", description: "Configure your preferences", icon: "2" },
    { title: "Launch", description: "Start using our platform", icon: "3" },
    {
      title: "Succeed",
      description: "Achieve your goals with ease",
      icon: "4",
    },
  ];

  // Horizontal Steps
  if (layout === "horizontal-steps") {
    return (
      <ModuleContainer containerSettings={content.containerSettings} className="bg-background" > 
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "relative",
              isMobile ? "space-y-8" : "flex justify-between items-start"
            )}
          >
            {!isMobile && (
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-primary/20" />
            )}
            {steps.map((step: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "relative",
                  isMobile
                    ? "flex items-center gap-4"
                    : "flex-1 max-w-xs text-center"
                )}
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg relative z-10",
                    isMobile ? "flex-shrink-0" : "mx-auto mb-4"
                  )}
                >
                  {step.icon || idx + 1}
                </div>
                <div className={cn(isMobile ? "flex-1" : "")}>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Vertical Steps
  if (layout === "vertical-steps") {
    return (
    <ModuleContainer containerSettings={content.containerSettings}>
        <div className={cn("container mx-auto max-w-2xl", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="space-y-8">
            {steps.map((step: any, idx: number) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {step.icon || idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Card Steps
  if (layout === "card-steps") {
    return (
    <ModuleContainer containerSettings={content.containerSettings}>
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "grid gap-6",
              isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
            )}
          >
            {steps.map((step: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">
                  {step.icon || idx + 1}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Icon Steps
  if (layout === "icon-steps") {
    return (
    <ModuleContainer containerSettings={content.containerSettings}>
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "grid gap-8",
              isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
            )}
          >
            {steps.map((step: any, idx: number) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 rounded bg-primary" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Default Steps
  return (
    <ModuleContainer containerSettings={content.containerSettings}> 
      <div className={cn("container mx-auto", isMobile && "px-4")}>
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div
          className={cn("grid gap-8", isMobile ? "grid-cols-1" : "grid-cols-4")}
        >
          {steps.map((step: any, idx: number) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4">
                {step.icon || idx + 1}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ModuleContainer>
  );
};
