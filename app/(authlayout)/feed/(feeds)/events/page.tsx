"use client";

export default function EventsFeed() {
  return (
    <div className="min-h-screen py-40 text-center">
      <div className="max-w-md mx-auto p-10 bg-zinc-50 border border-zinc-100 rounded-[32px]">
        <div className="h-16 w-16 rounded-3xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center mx-auto mb-6">
           <span className="text-3xl">🗓️</span>
        </div>
        <h3 className="text-xl font-black text-zinc-900 tracking-tight mb-2">Upcoming Events</h3>
        <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-8">
           Follow along for upcoming local gatherings, virtual workshops, and community-wide milestones.
        </p>
      </div>
    </div>
  );
}
