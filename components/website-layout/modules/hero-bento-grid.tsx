import { LayoutGrid, Zap } from "lucide-react";

export const HeroBentoGrid = ({
  content,
}: {
  content: Record<string, any>;
}) => {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          {content.title || "Everything you need"}
        </h1>
        <p className="text-lg opacity-60">
          {content.description ||
            "A powerful set of features to help you grow your business."}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
        <div className="md:col-span-2 md:row-span-2 bg-white p-8 rounded-3xl border shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-200" />
          <h3 className="text-2xl font-bold mb-2 relative z-10">Analytics</h3>
          <p className="opacity-60 relative z-10">
            Real-time insights into your community growth.
          </p>
          <div className="mt-8 relative z-10 border rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop"
              className="w-full"
              alt="Analytics"
            />
          </div>
        </div>
        <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute inset-0 bg-blue-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <LayoutGrid className="h-8 w-8 relative z-10" />
          <div className="relative z-10">
            <h3 className="font-bold text-lg">Layouts</h3>
            <p className="opacity-60 text-sm">Themeable</p>
          </div>
        </div>
        <div className="bg-orange-50 p-8 rounded-3xl flex flex-col justify-between border group hover:border-orange-200 transition-colors">
          <Zap className="h-8 w-8 text-orange-500" />
          <div>
            <h3 className="font-bold text-lg text-orange-900">Fast</h3>
            <p className="opacity-60 text-sm text-orange-800">Edge optimized</p>
          </div>
        </div>
        <div className="md:col-span-2 bg-blue-50 p-8 rounded-3xl border flex items-center justify-between group">
          <div>
            <h3 className="text-2xl font-bold mb-1 text-blue-900">Community</h3>
            <p className="text-blue-700/60">Connect with others</p>
          </div>
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
