"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  GripVertical,
  Settings2,
  Info,
  Sparkles,
  ShieldCheck,
  Users2,
  MessageSquare,
  BarChart2,
  Film,
  LucideIcon,
  RotateCcw,
  Loader2,
  Save,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUpdateFeedOrder } from "@/graphql/actions";

interface SourceItem {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  enabled: boolean;
}

interface FeedSourceOrderingProps {
  initialSources: SourceItem[];
  onOrderChange?: (newOrder: string[]) => void;
}

const FeedSourceOrdering: React.FC<FeedSourceOrderingProps> = ({
  initialSources,
  onOrderChange,
}) => {
  const [sources, setSources] = useState<SourceItem[]>(initialSources);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [updateOrder] = useUpdateFeedOrder();

  // Sync with initialSources if they change from parent
  useEffect(() => {
    setSources(initialSources);
    setIsDirty(false);
  }, [initialSources]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sources);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSources(items);
    setSaved(false);

    // Check if order actually changed from initial
    const currentOrder = items.map((s) => s.id).join(",");
    const initialOrder = initialSources.map((s) => s.id).join(",");
    setIsDirty(currentOrder !== initialOrder);

    if (onOrderChange) {
      onOrderChange(items.map((s) => s.id));
    }
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const order = sources.map((s) => s.id);

      const { data } = await updateOrder({
        variables: {
          input: {
            order,
          },
        },
      });

      if (data?.updateFeedOrder) {
        toast.success("Feed prioritization sequence updated.");
        setIsDirty(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        throw new Error("Failed to synchronize protocols.");
      }
    } catch (error) {
      toast.error("Failed to synchronize sequence protocols.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSources(initialSources);
    setIsDirty(false);
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Header / Info Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-zinc-900 tracking-tight">
              Feed Order
            </h3>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-emerald-600 uppercase tracking-wider border border-emerald-100">
              Live Order
            </span>
          </div>
          <p className="text-[12px] text-zinc-400 max-w-md">
            Drag and drop to change the order of content in your feed.
          </p>
        </div>

        {/* Floating Action Bar (logic moved to bottom of component) */}
      </div>

      {/* Drag & Drop List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="feed-sources">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2.5"
            >
              {sources.map((source, index) => (
                <Draggable
                  key={source.id}
                  draggableId={source.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "group relative flex items-center gap-4 p-3 rounded-xl border transition-all duration-200",
                        snapshot.isDragging
                          ? "bg-white border-zinc-900 shadow-xl z-50 scale-[1.02]"
                          : "bg-zinc-50/50 border-zinc-100 hover:border-zinc-200 hover:bg-white",
                      )}
                    >
                      {/* Drag Handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="p-1.5 rounded-lg text-zinc-300 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical size={16} />
                      </div>

                      {/* Rank Indicator */}
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white border border-zinc-100 text-[10px] font-bold text-zinc-400 tabular-nums">
                        {index + 1}
                      </div>

                      {/* Icon & Label */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 shadow-sm group-hover:bg-zinc-50 transition-colors">
                          <source.icon size={18} strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[13.5px] font-medium text-zinc-900 leading-none">
                            {source.label
                              .replace("Show ", "")
                              .replace(" in Feed", "")}
                          </h4>
                          <p className="mt-1.5 text-[11.5px] text-zinc-400 leading-relaxed truncate max-w-[300px]">
                            {source.description}
                          </p>
                        </div>
                      </div>

                      {/* Status / Tags */}
                      <div className="flex items-center gap-3 shrink-0 mr-2">
                        {!source.enabled && (
                          <span className="text-[10px] font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100/50">
                            Disabled in Config
                          </span>
                        )}
                        {source.enabled && (
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Footer Disclaimer */}
      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-50 border border-zinc-100/80">
        <Info size={14} className="text-zinc-400 mt-0.5 shrink-0" />
        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
          Changes will be applied to all users once saved.
        </p>
      </div>

      {/* ── Floating Action Bar ── */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-5 py-3 rounded-2xl bg-zinc-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white/90 leading-none">
                Unsaved Changes
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5">
                You have changed the order
              </span>
            </div>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="h-9 px-4 rounded-xl text-[12px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-40 flex items-center gap-2"
              >
                <RotateCcw size={13} />
                Discard
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={isSaving}
                className="h-9 px-5 rounded-xl text-[12px] font-bold bg-white text-zinc-900 hover:bg-zinc-200 transition-all disabled:opacity-60 flex items-center gap-2 shadow-lg"
              >
                {isSaving ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                Save
              </button>
            </div>
          </motion.div>
        )}
        {!isDirty && saved && (
          <motion.div
            key="saved-floating"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-xl bg-emerald-500 text-white text-[12px] font-bold shadow-xl flex items-center gap-2"
          >
            <Check size={14} strokeWidth={3} />
            Sequence Saved
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedSourceOrdering;
