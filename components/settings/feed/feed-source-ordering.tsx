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
  LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [isDirty, setIsDirty] = useState(false);

  // Sync with initialSources if they change from parent
  useEffect(() => {
    setSources(initialSources);
  }, [initialSources]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sources);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSources(items);
    setIsDirty(true);
    
    if (onOrderChange) {
      onOrderChange(items.map(s => s.id));
    }
  };

  const handleSaveOrder = async () => {
    try {
      // Placeholder for the "different API" the user mentioned
      // In a real scenario, this would be a mutation like:
      // await updateFeedOrder({ variables: { order: sources.map(s => s.id) } });
      
      console.log("Saving new feed source sequence:", sources.map(s => s.id));
      
      toast.success("Feed prioritization sequence updated.");
      setIsDirty(false);
    } catch (error) {
      toast.error("Failed to synchronize sequence protocols.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Info Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-zinc-900 tracking-tight">
              Feed Prioritization
            </h3>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-emerald-600 uppercase tracking-wider border border-emerald-100">
              Active Sequence
            </span>
          </div>
          <p className="text-[12px] text-zinc-400 max-w-md">
            Determine the hierarchy of content sources. Items at the top take precedence in the unified activity stream.
          </p>
        </div>

        <AnimatePresence>
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Button
                onClick={handleSaveOrder}
                size="sm"
                className="h-8 px-4 bg-zinc-900 text-white hover:bg-zinc-800 text-[11px] font-medium rounded-lg shadow-sm gap-1.5"
              >
                <Sparkles size={12} className="text-emerald-400" />
                Apply Sequence
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
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
                <Draggable key={source.id} draggableId={source.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "group relative flex items-center gap-4 p-3 rounded-xl border transition-all duration-200",
                        snapshot.isDragging
                          ? "bg-white border-zinc-900 shadow-xl z-50 scale-[1.02]"
                          : "bg-zinc-50/50 border-zinc-100 hover:border-zinc-200 hover:bg-white"
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
                            {source.label.replace("Show ", "").replace(" in Feed", "")}
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
          Source weights are processed in real-time. Reordering will affect the architectural density of content distribution 
          across all active user sessions once synchronized with the registry.
        </p>
      </div>
    </div>
  );
};

export default FeedSourceOrdering;
