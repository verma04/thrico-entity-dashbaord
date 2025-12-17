import React from "react";

interface HeroCreatorShowcaseProps {
  content: Record<string, any>;
}

const HeroCreatorShowcase: React.FC<HeroCreatorShowcaseProps> = ({
  content,
}) => {
  const creators = [
    { name: "Sarah K.", role: "Designer", color: "from-pink-400 to-rose-500" },
    { name: "Mike R.", role: "Developer", color: "from-blue-400 to-cyan-500" },
    { name: "Emma L.", role: "Writer", color: "from-purple-400 to-indigo-500" },
    { name: "Alex T.", role: "Artist", color: "from-orange-400 to-amber-500" },
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
    { name: "Nina P.", role: "Coach", color: "from-fuchsia-400 to-pink-500" },
    { name: "Dan W.", role: "Creator", color: "from-teal-400 to-cyan-500" },
  ];

  return (
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
        {creators.map((creator, i) => (
          <div
            key={i}
            className="group relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-purple-200 transition-all hover:shadow-xl cursor-pointer"
          >
            <div
              className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${creator.color} mb-3 group-hover:scale-110 transition-transform`}
            />
            <h3 className="font-bold text-slate-900 text-sm">{creator.name}</h3>
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
  );
};

export default HeroCreatorShowcase;
