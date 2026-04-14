"use client";

import React, { useState } from "react";
import { Rss, LayoutGrid, ListOrdered } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FeedVisibility from "@/components/settings/feed/feed-visibility";
import FeedSourceOrdering from "@/components/settings/feed/feed-source-ordering";
import { useEntitySettings } from "@/graphql/actions";
import { FEED_FIELDS } from "@/components/settings/feed/feed-visibility";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Manager component for Feed Prioritization
 */
const FeedOrderManager = () => {
  const { data, loading } = useEntitySettings();

  if (loading || !data) {
    return (
      <div className="flex flex-col gap-3 max-w-2xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full rounded-xl bg-zinc-50 animate-pulse" />
        ))}
      </div>
    );
  }

  const sources = FEED_FIELDS.map((f) => ({
    id: f.key,
    label: f.label,
    description: f.description,
    icon: f.icon || Rss,
    enabled: !!(data.getEntitySettings as any)[f.key],
  }));

  return (
    <div className="max-w-2xl px-4 sm:px-0">
      <FeedSourceOrdering 
        initialSources={sources} 
        onOrderChange={(order) => {
          console.log("Priority updated in registry:", order);
        }}
      />
    </div>
  );
};

const FeedSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("registry");

  return (
    <div className="space-y-8 pb-32">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white shrink-0">
            <Rss size={16} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-[17px] font-semibold text-zinc-900 tracking-tight leading-none">
              Feed Settings
            </h1>
            <p className="mt-1.5 text-[13px] text-zinc-400 font-normal">
              Choose what shows up in your feed and the order they appear.
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <Tabs defaultValue="registry" className="w-full" onValueChange={setActiveTab}>
        <div className="border-b border-zinc-100 mb-8">
          <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
            <TabsTrigger 
              value="registry" 
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 data-[state=active]:bg-transparent text-zinc-400 data-[state=active]:text-zinc-900 text-[13px] font-medium transition-all gap-2"
            >
              <LayoutGrid size={14} />
              Visibility
            </TabsTrigger>
            <TabsTrigger 
              value="prioritization" 
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 data-[state=active]:bg-transparent text-zinc-400 data-[state=active]:text-zinc-900 text-[13px] font-medium transition-all gap-2"
            >
              <ListOrdered size={14} />
              Ordering
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <TabsContent value="registry" key="registry" className="mt-0 outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* 
                  Note: FeedVisibility already contains a PlatformSettingsPage which has its own header.
                  To avoid double headers, we normally would refactor FeedVisibility to JUST show the rows.
                  But for now we keep it as is for protocol safety.
                */}
                <FeedVisibility />
              </motion.div>
            </TabsContent>

            <TabsContent value="prioritization" key="prioritization" className="mt-0 outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FeedOrderManager />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
};

export default FeedSettingsPage;
