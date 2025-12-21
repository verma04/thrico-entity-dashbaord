import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import { ModuleContainer } from "../modules/module-container";

interface AboutRendererProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

export const AboutRenderer = ({
  module,
  previewDevice = "desktop",
}: AboutRendererProps) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  return (
    <>
      {/* 1. STORY & VISION */}
      {layout === "story-vision" && (
        <ModuleContainer containerSettings={content.containerSettings}>
          <div className={cn("space-y-16", isMobile && "space-y-12")}>
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className={cn("text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent", isMobile && "text-4xl")}>
                {content.title || "Our Story"}
              </h1>
              <p className={cn("text-xl text-muted-foreground leading-relaxed", isMobile && "text-lg")}>
                {content.subtitle || "Building the future, one step at a time"}
              </p>
            </div>

            {/* Story Timeline */}
            <div className={cn("grid gap-12 items-center", !isMobile && "grid-cols-2")}>
              <div className="space-y-6">
                <h2 className={cn("text-3xl font-bold", isMobile && "text-2xl")}>The Journey</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {content.story ||
                    "Our journey began with a simple idea: to create meaningful connections and empower communities to thrive together."}
                </p>
                <div className="space-y-4">
                  {(
                    content.milestones || [
                      { year: "2020", event: "Founded" },
                      { year: "2022", event: "10K Members" },
                      { year: "2024", event: "Global Expansion" },
                    ]
                  ).map((milestone: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className={cn("text-2xl font-bold text-primary", isMobile && "text-xl")}>
                        {milestone.year}
                      </div>
                      <div className="flex-1 border-l-2 border-primary/20 pl-4">
                        <p className="font-medium">{milestone.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={cn("bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 h-96 flex items-center justify-center", isMobile && "h-64 p-6")}>
                {content.image ? (
                  <img
                    src={content.image}
                    alt="Our Story"
                    className="rounded-lg max-h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p className={cn("text-6xl mb-4", isMobile && "text-4xl")}>🚀</p>
                    <p>Our Journey</p>
                  </div>
                )}
              </div>
            </div>

            {/* Vision */}
            <div className={cn("bg-card border rounded-2xl p-12 text-center", isMobile && "p-6")}>
              <h2 className={cn("text-3xl font-bold mb-6", isMobile && "text-2xl mb-4")}>Our Vision</h2>
              <p className={cn("text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed", isMobile && "text-lg")}>
                {content.vision ||
                  "To create a world where every community has the tools and support to achieve their full potential."}
              </p>
            </div>
          </div>
        </ModuleContainer>
      )}

      {/* 2. MISSION & VALUES */}
      {layout === "mission-values" && (
        <ModuleContainer containerSettings={content.containerSettings}>
          <div className={cn("space-y-16", isMobile && "space-y-12")}>
            {/* Mission Statement */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className={cn("text-5xl font-bold", isMobile && "text-3xl")}>
                {content.title || "Mission & Values"}
              </h1>
              <div className={cn("bg-primary/10 border-l-4 border-primary rounded-r-lg p-6", isMobile && "p-4")}>
                <p className={cn("text-xl font-medium", isMobile && "text-lg")}>
                  {content.mission ||
                    "Empowering communities to connect, collaborate, and grow together."}
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div>
              <h2 className={cn("text-3xl font-bold text-center mb-12", isMobile && "text-2xl mb-8")}>
                Core Values
              </h2>
              <div className={cn("grid gap-6", !isMobile && "grid-cols-2 lg:grid-cols-3")}>
                {(
                  content.values || [
                    {
                      icon: "Heart",
                      title: "Community First",
                      description:
                        "We put our members at the center of everything we do",
                    },
                    {
                      icon: "Shield",
                      title: "Trust & Safety",
                      description:
                        "Creating a secure environment for authentic connections",
                    },
                    {
                      icon: "Zap",
                      title: "Innovation",
                      description:
                        "Constantly evolving to meet community needs",
                    },
                    {
                      icon: "Users",
                      title: "Inclusivity",
                      description:
                        "Welcoming diverse perspectives and backgrounds",
                    },
                    {
                      icon: "Target",
                      title: "Impact",
                      description:
                        "Measuring success by community growth and engagement",
                    },
                    {
                      icon: "Star",
                      title: "Excellence",
                      description: "Delivering quality experiences every day",
                    },
                  ]
                ).map((value: any, i: number) => (
                  <div
                    key={i}
                    className={cn("bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow", isMobile && "p-4")}
                  >
                    <div className={cn("w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4", isMobile && "w-10 h-10 mb-3")}>
                      <DynamicIcon
                        name={value.icon}
                        className={cn("h-6 w-6 text-primary", isMobile && "h-5 w-5")}
                      />
                    </div>
                    <h3 className={cn("text-lg font-bold mb-2", isMobile && "text-base")}>{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModuleContainer>
      )}

      {/* 3. FOUNDER'S MESSAGE */}
      {layout === "founder-message" && (
        <ModuleContainer containerSettings={content.containerSettings}>
          <div className={cn("max-w-5xl mx-auto space-y-12", isMobile && "space-y-8")}>
            <div className="text-center space-y-4">
              <h1 className={cn("text-5xl font-bold", isMobile && "text-3xl")}>
                {content.title || "A Message from Our Founder"}
              </h1>
            </div>

            <div className={cn("grid gap-8 items-start", !isMobile && "grid-cols-3")}>
              {/* Founder Image */}
              <div>
                <div className={cn(!isMobile && "sticky top-8")}>
                  {content.founderImage ? (
                    <img
                      src={content.founderImage}
                      alt="Founder"
                      className={cn("rounded-2xl w-full aspect-square object-cover border-4 border-primary/20", isMobile && "max-w-sm mx-auto border-2")}
                    />
                  ) : (
                    <div className={cn("w-full aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center", isMobile && "max-w-sm mx-auto")}>
                      <div className={cn("text-6xl", isMobile && "text-4xl")}>👤</div>
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <h3 className={cn("font-bold text-lg", isMobile && "text-base")}>
                      {content.founderName || "John Doe"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {content.founderTitle || "Founder & CEO"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className={cn(!isMobile && "col-span-2", "space-y-6")}>
                <div className={cn("text-6xl text-primary/20", isMobile && "text-4xl")}>"</div>
                <div className={cn("space-y-4 text-lg text-muted-foreground leading-relaxed", isMobile && "text-base")}>
                  <p>
                    {content.message ||
                      "When we started this journey, we had a simple vision: to create a platform where communities could truly thrive."}
                  </p>
                  <p>
                    {content.message2 ||
                      "Today, I'm proud to see thousands of communities using our platform to connect, collaborate, and achieve their goals together."}
                  </p>
                  <p>
                    {content.message3 ||
                      "This is just the beginning. We're committed to continuously improving and innovating to serve you better."}
                  </p>
                </div>
                {content.signature && (
                  <div className="pt-6">
                    <img
                      src={content.signature}
                      alt="Signature"
                      className="h-16"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModuleContainer>
      )}

      {/* 4. IMPACT & GROWTH */}
      {layout === "impact-growth" && (
        <ModuleContainer containerSettings={content.containerSettings}>
          <div className={cn("space-y-16", isMobile && "space-y-12")}>
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className={cn("text-5xl font-bold", isMobile && "text-3xl")}>
                {content.title || "Our Impact"}
              </h1>
              <p className={cn("text-xl text-muted-foreground", isMobile && "text-lg")}>
                {content.subtitle ||
                  "Measuring success through community growth and engagement"}
              </p>
            </div>

            {/* Key Metrics */}
            <div className={cn("grid gap-6", isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4")}>
              {(
                content.stats || [
                  { value: "50K+", label: "Active Members", icon: "Users" },
                  { value: "1M+", label: "Connections Made", icon: "Heart" },
                  { value: "200+", label: "Communities", icon: "Globe" },
                  { value: "98%", label: "Satisfaction Rate", icon: "Star" },
                ]
              ).map((stat: any, i: number) => (
                <div
                  key={i}
                  className={cn("bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 text-center", isMobile && "p-4")}
                >
                  <DynamicIcon
                    name={stat.icon}
                    className={cn("h-8 w-8 text-primary mx-auto mb-3", isMobile && "h-6 w-6 mb-2")}
                  />
                  <div className={cn("text-4xl font-bold text-primary mb-2", isMobile && "text-2xl mb-1")}>
                    {stat.value}
                  </div>
                  <div className={cn("text-sm text-muted-foreground", isMobile && "text-xs")}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Growth Chart Placeholder */}
            <div className={cn("bg-card border rounded-2xl p-8", isMobile && "p-4")}>
              <h2 className={cn("text-2xl font-bold mb-6", isMobile && "text-xl mb-4")}>Growth Over Time</h2>
              <div className={cn("h-64 bg-gradient-to-t from-primary/5 to-transparent rounded-lg flex items-end justify-around p-4", isMobile && "h-48 p-2")}>
                {[40, 60, 55, 75, 70, 90, 85, 100].map((height, i) => (
                  <div
                    key={i}
                    className={cn("flex-1 mx-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t", isMobile && "mx-0.5")}
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className={cn("flex justify-around mt-4 text-xs text-muted-foreground", isMobile && "mt-3")}>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(
                  (month, i) => (
                    <span key={i}>{month}</span>
                  )
                )}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className={cn("text-3xl font-bold text-center mb-8", isMobile && "text-2xl mb-6")}>
                Key Achievements
              </h2>
              <div className={cn("grid gap-6", !isMobile && "grid-cols-2")}>
                {(
                  content.achievements || [
                    {
                      year: "2024",
                      title: "Best Community Platform Award",
                      description:
                        "Recognized for innovation in community building",
                    },
                    {
                      year: "2023",
                      title: "Reached 50K Members",
                      description: "Milestone achievement in user growth",
                    },
                    {
                      year: "2022",
                      title: "Series A Funding",
                      description: "Secured $10M to expand platform features",
                    },
                    {
                      year: "2021",
                      title: "Product Launch",
                      description: "Successfully launched v1.0 to the public",
                    },
                  ]
                ).map((achievement: any, i: number) => (
                  <div
                    key={i}
                    className={cn("flex gap-4 bg-card border rounded-lg p-6", isMobile && "gap-3 p-4")}
                  >
                    <div className={cn("text-2xl font-bold text-primary flex-shrink-0", isMobile && "text-xl")}>
                      {achievement.year}
                    </div>
                    <div className="flex-1">
                      <h3 className={cn("font-bold mb-1", isMobile && "text-sm")}>{achievement.title}</h3>
                      <p className={cn("text-sm text-muted-foreground", isMobile && "text-xs")}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModuleContainer>
      )}

      {/* 5. SIMPLE OVERVIEW */}
      {layout === "simple-overview" && (
        <ModuleContainer containerSettings={content.containerSettings}>
          <div className={cn("max-w-4xl mx-auto space-y-12", isMobile && "space-y-8")}>
            <div className="text-center space-y-6">
              <h1 className={cn("text-5xl font-bold", isMobile && "text-3xl")}>
                {content.title || "About Us"}
              </h1>
              <p className={cn("text-xl text-muted-foreground leading-relaxed", isMobile && "text-lg")}>
                {content.description ||
                  "We're on a mission to empower communities worldwide."}
              </p>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {content.intro ||
                  "Founded in 2020, we've been dedicated to creating tools that help communities thrive. Our platform brings people together, facilitates meaningful connections, and provides the resources needed for collective success."}
              </p>
            </div>

            {/* Quick Stats */}
            <div className={cn("grid grid-cols-3 gap-6 py-8 border-y", isMobile && "gap-3 py-6")}>
              {(
                content.quickStats || [
                  { value: "50K+", label: "Members" },
                  { value: "200+", label: "Communities" },
                  { value: "4.9/5", label: "Rating" },
                ]
              ).map((stat: any, i: number) => (
                <div key={i} className="text-center">
                  <div className={cn("text-3xl font-bold text-primary mb-1", isMobile && "text-2xl")}>
                    {stat.value}
                  </div>
                  <div className={cn("text-sm text-muted-foreground", isMobile && "text-xs")}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* What We Do */}
            <div className="space-y-6">
              <h2 className={cn("text-2xl font-bold", isMobile && "text-xl")}>What We Do</h2>
              <div className={cn("grid gap-4", !isMobile && "grid-cols-2")}>
                {(
                  content.features || [
                    {
                      icon: "Users",
                      title: "Community Building",
                      description:
                        "Tools to create and manage thriving communities",
                    },
                    {
                      icon: "MessageSquare",
                      title: "Engagement",
                      description:
                        "Features that drive meaningful interactions",
                    },
                    {
                      icon: "BarChart",
                      title: "Analytics",
                      description:
                        "Insights to understand and grow your community",
                    },
                    {
                      icon: "Shield",
                      title: "Security",
                      description: "Enterprise-grade security and privacy",
                    },
                  ]
                ).map((feature: any, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div className={cn("w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0", isMobile && "w-9 h-9")}>
                      <DynamicIcon
                        name={feature.icon}
                        className={cn("h-5 w-5 text-primary", isMobile && "h-4 w-4")}
                      />
                    </div>
                    <div>
                      <h3 className={cn("font-semibold mb-1", isMobile && "text-sm")}>{feature.title}</h3>
                      <p className={cn("text-sm text-muted-foreground", isMobile && "text-xs")}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className={cn("bg-primary/10 rounded-xl p-8 text-center", isMobile && "p-6")}>
              <h3 className={cn("text-2xl font-bold mb-3", isMobile && "text-xl mb-2")}>Ready to Join Us?</h3>
              <p className={cn("text-muted-foreground mb-6", isMobile && "text-sm mb-4")}>
                {content.ctaText || "Start building your community today"}
              </p>
              <a
                href={content.ctaHref || "#"}
                className={cn("bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-block", isMobile && "px-5 py-2.5 text-sm")}
              >
                {content.ctaButtonText || "Get Started"}
              </a>
            </div>
          </div>
        </ModuleContainer>
      )}
    </>
  );
};
