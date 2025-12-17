import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const PricingRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const title = content.title || "Choose Your Plan";
  const description =
    content.description || "Select the perfect plan for your needs";
  const plans = content.plans || [
    {
      name: "Starter",
      price: "$9",
      period: "month",
      description: "Perfect for small projects",
      features: ["5 Projects", "10GB Storage", "Email Support"],
      popular: false,
      buttonText: "Get Started",
    },
    {
      name: "Professional",
      price: "$29",
      period: "month",
      description: "Best for growing teams",
      features: [
        "Unlimited Projects",
        "100GB Storage",
        "Priority Support",
        "Advanced Analytics",
      ],
      popular: true,
      buttonText: "Choose Professional",
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For large organizations",
      features: [
        "Unlimited Everything",
        "Custom Integrations",
        "24/7 Support",
        "SLA Guarantee",
      ],
      popular: false,
      buttonText: "Contact Sales",
    },
  ];

  // Cards Layout
  if (layout === "cards-pricing") {
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
              "grid gap-8 max-w-6xl mx-auto",
              isMobile ? "grid-cols-1" : "grid-cols-3"
            )}
          >
            {plans.map((plan: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "bg-white rounded-lg border p-8 relative",
                  plan.popular && "border-primary shadow-lg scale-105"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature: string, featureIdx: number) => (
                    <li key={featureIdx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    "w-full py-3 px-4 rounded-lg font-medium transition-colors",
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "border border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Table Layout
  if (layout === "table-pricing") {
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
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-6 font-semibold">Features</th>
                    {plans.map((plan: any, idx: number) => (
                      <th key={idx} className="text-center p-6 min-w-[200px]">
                        <div className="font-bold text-lg">{plan.name}</div>
                        <div className="text-2xl font-bold mt-1">
                          {plan.price}
                          <span className="text-sm text-muted-foreground font-normal">
                            /{plan.period}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-6 font-medium">Description</td>
                    {plans.map((plan: any, idx: number) => (
                      <td
                        key={idx}
                        className="p-6 text-center text-sm text-muted-foreground"
                      >
                        {plan.description}
                      </td>
                    ))}
                  </tr>
                  {plans[0]?.features?.map(
                    (feature: string, featureIdx: number) => (
                      <tr key={featureIdx} className="border-b">
                        <td className="p-6">
                          {feature
                            .replace(/^\d+\s*/, "")
                            .replace(
                              /\s*(Support|Storage|Projects|Everything|Analytics|Integrations|Guarantee).*/,
                              "$1"
                            )}
                        </td>
                        {plans.map((plan: any, planIdx: number) => (
                          <td key={planIdx} className="p-6 text-center">
                            {plan.features[featureIdx] ? (
                              <Check className="w-5 h-5 text-primary mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                  <tr>
                    <td className="p-6"></td>
                    {plans.map((plan: any, idx: number) => (
                      <td key={idx} className="p-6 text-center">
                        <button
                          className={cn(
                            "px-6 py-2 rounded-lg font-medium transition-colors",
                            plan.popular
                              ? "bg-primary text-white hover:bg-primary/90"
                              : "border border-gray-300 hover:bg-gray-50"
                          )}
                        >
                          {plan.buttonText}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Toggle Layout
  if (layout === "toggle-pricing") {
    return (
      <section className="py-16 bg-background">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                {description}
              </p>
            )}
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button className="px-6 py-2 rounded-md bg-white shadow-sm font-medium">
                Monthly
              </button>
              <button className="px-6 py-2 rounded-md font-medium text-muted-foreground">
                Yearly
              </button>
            </div>
          </div>
          <div
            className={cn(
              "grid gap-8 max-w-4xl mx-auto",
              isMobile ? "grid-cols-1" : "grid-cols-3"
            )}
          >
            {plans.map((plan: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-center mb-6">
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-2">{plan.price}</div>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature: string, featureIdx: number) => (
                    <li
                      key={featureIdx}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default Simple Layout
  return (
    <section className="py-16 bg-gray-50">
      <div className={cn("container mx-auto", isMobile && "px-4")}>
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div
          className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-3")}
        >
          {plans.map((plan: any, idx: number) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border text-center"
            >
              <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
              <div className="text-2xl font-bold mb-4">{plan.price}</div>
              <ul className="space-y-1 mb-4 text-sm">
                {plan.features.map((feature: string, featureIdx: number) => (
                  <li key={featureIdx}>{feature}</li>
                ))}
              </ul>
              <button className="w-full py-2 px-4 bg-primary text-white rounded">
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
