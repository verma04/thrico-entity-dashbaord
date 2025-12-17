export const HeroSaasModern = ({
  content,
}: {
  content: Record<string, any>;
}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />{" "}
          {content.badge || "New Features 2.0"}
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
          {content.title || "Build Faster."}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
          {content.description ||
            "The ultimate platform for modern saas companies to scale their operations without technical debt."}
        </p>
        
        {/* CTA Buttons */}
        {content.buttons && content.buttons.length > 0 && (
          <div className="flex gap-4 pt-2">
            {content.buttons.map((button: any, index: number) => (
              <a
                key={index}
                href={button.link || "#"}
                className={
                  button.variant === "primary"
                    ? "px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg text-center"
                    : button.variant === "secondary"
                    ? "px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors shadow-lg text-center"
                    : button.variant === "outline"
                    ? "px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-center"
                    : "px-6 py-3 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors text-center"
                }
              >
                {button.text || "Button"}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl blur-3xl opacity-50 transform rotate-3" />
        <div className="relative bg-white border shadow-2xl rounded-2xl p-2 rotate-[-2deg] hover:rotate-0 transition-all duration-500">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
            className="rounded-xl w-full"
            alt="Dashboard"
          />
        </div>
      </div>
    </div>
  );
};
