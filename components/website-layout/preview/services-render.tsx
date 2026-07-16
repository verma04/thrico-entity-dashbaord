import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import {
  ArrowRight,
  Check,
  Star,
  Zap,
  Shield,
  Heart,
  Briefcase,
  Settings,
  Users,
} from "lucide-react";

interface ServicesRendererProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

export const ServiceRenderer = ({
  module,
  previewDevice = "desktop",
}: ServicesRendererProps) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const services = content.services || [
    {
      title: "Web Development",
      description: "Custom web applications built with modern technologies",
      icon: "code",
      features: ["Responsive Design", "Fast Performance", "SEO Optimized"],
      price: "$2,999",
      popular: false,
      image: "",
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications",
      icon: "smartphone",
      features: ["iOS & Android", "Push Notifications", "Offline Support"],
      price: "$4,999",
      popular: true,
      image: "",
    },
    {
      title: "UI/UX Design",
      description: "Beautiful and intuitive user interface design",
      icon: "palette",
      features: ["User Research", "Prototyping", "Design System"],
      price: "$1,999",
      popular: false,
      image: "",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">
            {content.title || "Our Services"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {content.subtitle ||
              "Comprehensive solutions to help your business grow"}
          </p>
        </div>

        {/* Grid Layout */}
        {layout === "grid" && (
          <div
            className={cn(
              "grid gap-8",
              isMobile
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {services.map((service: any, idx: number) => (
              <div
                key={idx}
                className="group relative bg-card rounded-2xl border p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Service Image or Icon */}
                  {service.image ? (
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <DynamicIcon
                        name={service.icon}
                        className="w-6 h-6 text-primary"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {service.features?.map((feature: any, featureIdx: number) => (
                      <li
                        key={featureIdx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {service.price}
                      </span>
                      <button className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card Layout */}
        {layout === "cards" && (
          <div
            className={cn(
              "grid gap-6",
              isMobile
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {services.map((service: any, idx: number) => (
              <div key={idx} className="relative group">
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium z-10">
                    Most Popular
                  </div>
                )}
                <div
                  className={cn(
                    "bg-card rounded-2xl border p-8 h-full transition-all duration-300",
                    service.popular
                      ? "border-primary shadow-lg scale-105"
                      : "hover:shadow-md"
                  )}
                >
                  <div className="text-center space-y-6">
                    {/* Service Image or Icon */}
                    {service.image ? (
                      <div className="aspect-video rounded-2xl overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                        <DynamicIcon
                          name={service.icon}
                          className="w-8 h-8 text-primary"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{service.title}</h3>
                      <p className="text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      {service.price}
                    </div>
                    <ul className="space-y-3 text-left">
                      {service.features?.map((feature: any, featureIdx: number) => (
                        <li
                          key={featureIdx}
                          className="flex items-center gap-3"
                        >
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={cn(
                        "w-full py-3 px-6 rounded-xl font-medium transition-all",
                        service.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      )}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List Layout */}
        {layout === "list" && (
          <div className="space-y-6">
            {services.map((service: any, idx: number) => (
              <div
                key={idx}
                className="group bg-card rounded-2xl border p-8 hover:shadow-md transition-all"
              >
                <div
                  className={cn(
                    "flex gap-8 items-center",
                    isMobile && "flex-col text-center"
                  )}
                >
                  {/* Service Image or Icon */}
                  {service.image ? (
                    <div className="flex-shrink-0">
                      <div className={cn("rounded-2xl overflow-hidden", isMobile ? "w-20 h-20" : "w-32 h-32")}>
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <DynamicIcon
                          name={service.icon}
                          className="w-8 h-8 text-primary"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.features?.map((feature: any, featureIdx: number) => (
                        <span
                          key={featureIdx}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          <Check className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-3xl font-bold text-primary mb-4">
                      {service.price}
                    </div>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all group-hover:gap-3">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Layout */}
        {layout === "featured" && (
          <div className="space-y-12">
            {services.map((service: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "grid gap-12 items-center",
                  isMobile ? "grid-cols-1" : "grid-cols-2",
                  idx % 2 === 1 && !isMobile && "grid-cols-2"
                )}
              >
                <div
                  className={cn(
                    "space-y-6",
                    idx % 2 === 1 && !isMobile && "order-2"
                  )}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <Star className="w-4 h-4" />
                    {service.popular ? "Most Popular" : "Featured Service"}
                  </div>
                  <h3 className="text-3xl font-bold">{service.title}</h3>
                  <p className="text-lg text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features?.map((feature: any, featureIdx: number) => (
                      <li key={featureIdx} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-6 pt-4">
                    <div className="text-4xl font-bold text-primary">
                      {service.price}
                    </div>
                    <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:gap-3">
                      Get Started <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div
                  className={cn(
                    "relative",
                    idx % 2 === 1 && !isMobile && "order-1"
                  )}
                >
                  {/* Service Image or Icon */}
                  {service.image ? (
                    <div className="aspect-square rounded-3xl overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center">
                      <DynamicIcon
                        name={service.icon}
                        className="w-24 h-24 text-primary"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
