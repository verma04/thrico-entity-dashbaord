import { ModuleData } from "@/store/ts-types";
import { cn } from "@/lib/utils";

interface HeroLegacyModuleProps {
  content: ModuleData["content"];
  layout: string;
}

export const HeroLegacyModule = ({
  content,
  layout,
}: HeroLegacyModuleProps) => {
  return (
    <>
      {/* DARK CINEMATIC */}
      {layout === "dark-cinematic" && (
        <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
          <div className="mx-auto w-20 h-1 bg-white/20 rounded-full" />
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            {content.title?.split(" ")[0] || "UNLEASH"} <br />
            <span className="text-white">
              {content.title?.split(" ").slice(1).join(" ") || "CREATIVITY"}
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
            {content.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 items-center">
            {content.slides &&
              content.slides.slice(0, 3).map((slide: any, i: number) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl aspect-[9/16] cursor-pointer"
                >
                  <img
                    src={slide.image}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 p-6 text-left">
                    <h3 className="text-xl font-bold">{slide.title}</h3>
                    <p className="text-sm opacity-70 mt-1">{slide.subtitle}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* APP SHOWCASE */}
      {layout === "app-showcase" && (
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                Available Now
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                {content.title || "Your App, Everywhere"}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                {content.description ||
                  "Download our mobile app and take your experience on the go. Available for iOS and Android devices."}
              </p>

              <div className="flex gap-4 pt-4">
                <div className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Get it on</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400"
                      />
                    ))}
                  </div>
                  <span>50K+ downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="font-semibold text-slate-700">4.8</span>
                </div>
              </div>
            </div>

            <div className="relative order-1 md:order-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-blue-200 rounded-3xl blur-3xl opacity-30 transform rotate-6" />
              <div className="relative flex justify-center gap-4">
                <div className="w-64 h-[500px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2340&auto=format&fit=crop"
                      className="w-full h-full object-cover"
                      alt="App Screen 1"
                    />
                  </div>
                </div>
                <div className="w-64 h-[500px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 mt-12">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=2340&auto=format&fit=crop"
                      className="w-full h-full object-cover"
                      alt="App Screen 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATOR SHOWCASE */}
      {layout === "creator-showcase" && (
        <div className="max-w-5xl mx-auto px-6 space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
              {content.title || "Join Our Creator Community"}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {content.description ||
                "Connect with thousands of creators, share your work, and grow together."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {[
              {
                name: "Sarah K.",
                role: "Designer",
                color: "from-pink-400 to-rose-500",
              },
              {
                name: "Mike R.",
                role: "Developer",
                color: "from-blue-400 to-cyan-500",
              },
              {
                name: "Emma L.",
                role: "Writer",
                color: "from-purple-400 to-indigo-500",
              },
              {
                name: "Alex T.",
                role: "Artist",
                color: "from-orange-400 to-amber-500",
              },
              {
                name: "Lisa M.",
                role: "Photographer",
                color: "from-green-400 to-emerald-500",
              },
              {
                name: "Tom H.",
                role: "Musician",
                color: "from-violet-400 to-purple-500",
              },
              {
                name: "Nina P.",
                role: "Coach",
                color: "from-fuchsia-400 to-pink-500",
              },
              {
                name: "Dan W.",
                role: "Creator",
                color: "from-teal-400 to-cyan-500",
              },
            ].map((creator, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-purple-200 transition-all hover:shadow-xl cursor-pointer"
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${creator.color} mb-3 group-hover:scale-110 transition-transform`}
                />
                <h3 className="font-bold text-slate-900 text-sm">
                  {creator.name}
                </h3>
                <p className="text-xs text-slate-500">{creator.role}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 pt-8">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
              Join 15,000+ Creators
            </button>
            <p className="text-sm text-slate-500">
              Free to join • No credit card required
            </p>
          </div>
        </div>
      )}

      {/* SINGLE IMAGE FOCUS */}
      {layout === "single-image" && (
        <div className="relative min-h-[600px] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                content.image ||
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
              })`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

          <div
            className="relative z-10 text-center max-w-4xl px-6 space-y-8"
            style={{ color: content.textColor || "#ffffff" }}
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                {content.title || "One Strong Message"}
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto font-light">
                {content.description ||
                  "Clear, focused communication that drives action with stunning visual impact."}
              </p>
            </div>

            {(content.ctaText || content.secondaryCtaText) && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {content.ctaText && (
                  <button className="px-8 py-4 bg-white text-slate-900 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl hover:shadow-xl hover:scale-105">
                    {content.ctaText}
                  </button>
                )}
                {content.secondaryCtaText && (
                  <button
                    className="px-8 py-4 bg-transparent border-2 border-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
                    style={{
                      borderColor: content.textColor || "#ffffff",
                      color: content.textColor || "#ffffff",
                    }}
                  >
                    {content.secondaryCtaText}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SPLIT BALANCED */}
      {layout === "split" && (
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
                  {content.badge || "Why Choose Us"}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                  {content.title || "Clear Communication Meets Visual Impact"}
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {content.description ||
                    "A balanced two-column layout that combines compelling copy with stunning visuals for maximum engagement and clarity."}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {(
                  content.features || [
                    "Easy to use",
                    "Powerful features",
                    "24/7 support",
                  ]
                ).map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {(content.ctaText || content.secondaryCtaText) && (
                <div className="flex gap-4 pt-6">
                  {content.ctaText && (
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg">
                      {content.ctaText}
                    </button>
                  )}
                  {content.secondaryCtaText && (
                    <button className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-semibold hover:border-slate-300 transition-colors">
                      {content.secondaryCtaText}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="relative order-1 md:order-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl blur-2xl opacity-40 transform -rotate-6" />
              <div className="relative">
                <img
                  src={
                    content.image ||
                    "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2340&auto=format&fit=crop"
                  }
                  alt="Hero Visual"
                  className="rounded-2xl shadow-2xl w-full hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for remaining generic layouts */}
      {["text", "full-image", "gradient"].includes(layout) && (
        <>
          {layout !== "text" && (
            <h1 className="text-4xl font-bold mb-4">
              {content.title || "Hero Title"}
            </h1>
          )}
          {layout === "text" && (
            <h1 className="text-6xl font-bold mb-6 tracking-tight text-slate-900">
              {content.title || "Hero Title"}
            </h1>
          )}
          <p className="text-lg opacity-80 max-w-xl mx-auto mb-6">
            {content.description ||
              "This is a description of the hero section that changes based on layout."}
          </p>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
            Get Started
          </button>
        </>
      )}
    </>
  );
};
