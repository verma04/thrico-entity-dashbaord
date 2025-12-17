import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";

export const TimelineRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const title = content.title || "Our Journey";
  const description = content.description || "A timeline of our key milestones";
  const events = content.events || [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to transform the industry",
    },
    {
      year: "2021",
      title: "First Product Launch",
      description: "Released our flagship product to the market",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded operations to 15 countries",
    },
    {
      year: "2023",
      title: "1M Users Milestone",
      description: "Reached one million active users worldwide",
    },
  ];

  // Vertical Timeline
  if (layout === "vertical-timeline") {
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

          <div className="space-y-8 max-w-3xl mx-auto">
            {events.map((event: any, idx: number) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0 w-20 text-right font-bold text-primary">
                  {event.year}
                </div>
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary mt-1" />
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Horizontal Timeline
  if (layout === "horizontal-timeline") {
    return (
      <section className="py-16 bg-background">
        <div
          className={cn("container mx-auto text-center", isMobile && "px-4")}
        >
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              {description}
            </p>
          )}

          <div
            className={cn(
              "relative",
              isMobile ? "space-y-8" : "flex justify-between items-start"
            )}
          >
            {!isMobile && (
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-primary/20" />
            )}

            {events.map((event: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "relative",
                  isMobile ? "text-center" : "flex-1 max-w-xs"
                )}
              >
                <div className="w-4 h-4 rounded-full bg-primary mx-auto mb-4 relative z-10 bg-white border-4 border-primary" />
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <div className="font-bold text-primary mb-2">
                    {event.year}
                  </div>
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Card Timeline
  if (layout === "card-timeline") {
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
              "grid gap-6",
              isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
            )}
          >
            {events.map((event: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-2xl font-bold text-primary mb-3">
                  {event.year}
                </div>
                <h3 className="font-semibold mb-3">{event.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Zigzag Timeline
  if (layout === "zigzag-timeline") {
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

          <div className="max-w-4xl mx-auto">
            {events.map((event: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "relative mb-12 last:mb-0",
                  isMobile
                    ? "text-center"
                    : idx % 2 === 0
                    ? "text-left"
                    : "text-right"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-8",
                    isMobile
                      ? "flex-col"
                      : idx % 2 === 0
                      ? "flex-row"
                      : "flex-row-reverse"
                  )}
                >
                  <div className="flex-1 bg-white p-6 rounded-lg border shadow-sm">
                    <div className="text-lg font-bold text-primary mb-2">
                      {event.year}
                    </div>
                    <h3 className="font-semibold mb-3">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary border-4 border-white shadow-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Minimal Timeline (default)
  return (
    <section className="py-16 bg-slate-50">
      <div className={cn("container mx-auto", isMobile && "px-4")}>
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div className="space-y-8 max-w-3xl mx-auto">
          {events.map((event: any, idx: number) => (
            <div key={idx} className="flex gap-6">
              <div className="flex-shrink-0 w-20 text-right font-bold text-primary">
                {event.year}
              </div>
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary mt-1" />
              <div className="flex-1 pb-8">
                <h3 className="font-semibold mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
