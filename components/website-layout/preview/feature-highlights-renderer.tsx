import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Check, Star, ArrowRight } from "lucide-react";

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
      icon: "⚡",
      highlight: true,
    },
    {
      title: "Secure & Reliable",
      description: "Bank-level security with 99.9% uptime guarantee",
      icon: "🔒",
      highlight: false,
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock support from our expert team",
      icon: "🎧",
      highlight: false,
    },
    {
      title: "Easy Integration",
      description:
        "Seamlessly integrate with your existing workflow in minutes",
      icon: "🔗",
      highlight: true,
    },
  ];

  // Grid Highlights Layout
  if (layout === "grid-highlights") {
    return (
      <section className="py-16 bg-background">
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
                <div className="text-4xl mb-4">{feature.icon}</div>
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
        </div>
      </section>
    );
  }

  // List Highlights Layout
  if (layout === "list-highlights") {
    return (
      <section className="py-16 bg-slate-50">
        <div className={cn("container mx-auto max-w-4xl", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="space-y-6">
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
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                    {feature.icon}
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
        </div>
      </section>
    );
  }

  // Cards Highlights Layout
  if (layout === "cards-highlights") {
    return (
      <section className="py-16 bg-background">
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
              isMobile ? "grid-cols-1" : "grid-cols-2"
            )}
          >
            {features.map((feature: any, idx: number) => (
              <div
                key={idx}
                className="group bg-white rounded-xl p-8 border hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {feature.highlight && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  </div>
                )}
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Icon Highlights Layout
  if (layout === "icon-highlights") {
    return (
      <section className="py-16 bg-slate-50">
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
            {features.map((feature: any, idx: number) => (
              <div key={idx} className="text-center group">
                <div
                  className={cn(
                    "w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl transition-all duration-300",
                    feature.highlight
                      ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
                      : "bg-white border-2 border-gray-200 group-hover:border-primary"
                  )}
                >
                  {feature.icon}
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
        </div>
      </section>
    );
  }

  // Default Simple Highlights
  return (
    <section className="py-16 bg-background">
      <div className={cn("container mx-auto", isMobile && "px-4")}>
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div
          className={cn(
            "grid gap-6",
            isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
          )}
        >
          {features.map((feature: any, idx: number) => (
            <div key={idx} className="text-center p-4">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
