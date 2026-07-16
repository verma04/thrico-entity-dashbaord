import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { ModuleContainer } from "../modules/module-container";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";

export const LogoCloudRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const title = content.title || "Trusted by leading companies";
  const logos = content.logos || [
    { name: "Microsoft", image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=400&h=200&fit=crop" },
    { name: "Google", image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=200&fit=crop" },
    { name: "Apple", image: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=400&h=200&fit=crop" },
    { name: "Amazon", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=200&fit=crop" },
    { name: "Meta", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop" },
    { name: "Tesla", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=200&fit=crop" },
  ];

  // Logo Grid
  if (layout === "logo-grid") {
    return (
      <ModuleContainer containerSettings={content.containerSettings} className="bg-background">
        <div
          className={cn("container mx-auto text-center", isMobile && "px-4")}
        >
          <h3 className="text-lg font-semibold text-muted-foreground mb-12">
            {title}
          </h3>
          <div
            className={cn(
              "grid gap-6 items-center justify-items-center",
              isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            )}
          >
            {logos.map((logo: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-center h-12 w-full opacity-50 hover:opacity-100 transition-opacity"
              >
                {logo.image ? (
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="h-6 w-6" />
                    {logo.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Logo Carousel
  if (layout === "logo-carousel") {
    return (
      <ModuleContainer containerSettings={content.containerSettings} className="bg-slate-50 overflow-hidden">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <h3 className="text-lg font-semibold text-muted-foreground text-center mb-12">
            {title}
          </h3>
          <div className="relative overflow-hidden">
            <div className="flex gap-8 md:gap-12 items-center animate-scroll">
              {[...logos, ...logos].map((logo: any, idx: number) => (
                <div
                  key={idx}
                  className="flex-shrink-0 flex items-center justify-center h-10 md:h-12 w-24 md:w-32 opacity-60"
                >
                {logo.image ? (
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="h-5 w-5" />
                    {logo.name}
                  </div>
                )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Monochrome Logos
  if (layout === "monochrome-logos") {
    return (
      <ModuleContainer containerSettings={content.containerSettings} className="bg-background">
        <div
          className={cn("container mx-auto text-center", isMobile && "px-4")}
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-12">
            {title}
          </h3>
          <div
            className={cn(
              "grid gap-6 items-center justify-items-center",
              isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            )}
          >
            {logos.map((logo: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-center h-10 w-full grayscale opacity-40 hover:opacity-60 transition-opacity"
              >
                {logo.image ? (
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Building2 className="h-5 w-5" />
                    {logo.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Featured Logos
  if (layout === "featured-logos") {
    return (
      <ModuleContainer containerSettings={content.containerSettings} className="bg-slate-50">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <h3 className="text-lg font-semibold text-center mb-12">{title}</h3>
          <div
            className={cn(
              "grid gap-4 md:gap-8",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
            )}
          >
            <div className="col-span-1 flex items-center justify-center border-2 border-primary bg-white rounded-xl p-6 md:p-8">
              {logos[0]?.image ? (
                <img
                  src={logos[0].image}
                  alt={logos[0].name}
                  className="max-h-16 max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <Building2 className="h-16 w-16 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-lg">
                    {logos[0]?.name || "Featured Partner"}
                  </div>
                </div>
              )}
            </div>
            <div
              className={cn(
                "grid gap-3 md:gap-4",
                isMobile ? "grid-cols-2" : "col-span-1 md:col-span-2 grid-cols-2 md:grid-cols-3"
              )}
            >
              {logos.slice(1).map((logo: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-center bg-white rounded-lg p-4 md:p-6 border"
                >
                  {logo.image ? (
                    <img
                      src={logo.image}
                      alt={logo.name}
                      className="max-h-12 max-w-full object-contain opacity-60"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-60">
                      <Building2 className="h-5 w-5" />
                      {logo.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Minimal Strip
  if (layout === "minimal-strip") {
    return (
      <ModuleContainer containerSettings={content.containerSettings} className="py-8 border-y">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="flex items-center justify-between gap-4 md:gap-8 flex-wrap">
            <span className="text-sm text-muted-foreground">{title}</span>
            <div className="flex items-center gap-4 md:gap-8 flex-wrap">
              {logos.slice(0, 4).map((logo: any, idx: number) => (
                <div key={idx} className="flex items-center justify-center h-8 opacity-50">
                  {logo.image ? (
                    <img
                      src={logo.image}
                      alt={logo.name}
                      className="max-h-full max-w-24 object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Building2 className="h-4 w-4" />
                      {logo.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModuleContainer>
    );
  }

  return null;
};
