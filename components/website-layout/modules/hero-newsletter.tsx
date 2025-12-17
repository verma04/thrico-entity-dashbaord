export const HeroNewsletter = ({
  content,
}: {
  content: Record<string, any>;
}) => {
  return (
    <div className="max-w-3xl mx-auto text-center px-6 space-y-8">
      <div className="space-y-4">
        <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
          📧 Join our newsletter
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
          {content.title || "Stay in the Loop"}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {content.description ||
            "Get the latest updates, exclusive content, and insider tips delivered straight to your inbox."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-4">
        <input
          type="email"
          placeholder="Enter your email address"
          className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400 transition-colors"
        />
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl whitespace-nowrap">
          Subscribe Now
        </button>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm text-slate-500 pt-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>No spam, ever</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Unsubscribe anytime</span>
        </div>
      </div>

      <p className="text-sm text-slate-400 pt-2">
        Join <span className="font-bold text-indigo-600">12,847</span>{" "}
        subscribers already reading
      </p>
    </div>
  );
};
