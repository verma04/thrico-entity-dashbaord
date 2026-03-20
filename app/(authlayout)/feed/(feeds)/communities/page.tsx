"use client";

export default function CommunitiesFeed() {
  return (
    <div className="min-h-screen py-40 text-center">
      <div className="max-w-md mx-auto p-10 bg-zinc-50 border border-zinc-100 rounded-[32px]">
        <div className="h-16 w-16 rounded-3xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center mx-auto mb-6">
           <span className="text-3xl">👥</span>
        </div>
        <h3 className="text-xl font-black text-zinc-900 tracking-tight mb-2">Community Groups</h3>
        <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-8">
          Stay tuned! We're curating the best group discussions and updates from your local ecosystem.
        </p>
      </div>
    </div>
  );
}
