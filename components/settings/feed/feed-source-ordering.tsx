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
  LucideIcon,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUpdateFeedOrder } from "@/graphql/actions";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

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
        toast.success("Feed prioritization sequence synchronized successfully.");
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
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Sequence Ranking */}
            <PolarisSidebarCard
              title="Current Sequence"
              badge="Live Order"
              icon={Sparkles}
            >
              <div className="space-y-1">
                {sources.map((source, idx) => (
                  <PolarisSummaryRow
                    key={source.id}
                    label={`#${idx + 1} ${source.label.replace("Show ", "").replace(" in Feed", "")}`}
                    value={source.enabled ? "Active" : "Disabled in Config"}
                    isLast={idx === sources.length - 1}
                  />
                ))}
              </div>
            </PolarisSidebarCard>

            {/* Algorithm Guidance Tip */}
            <PolarisTipCard title="Feed Ranking Tip">
              Placing dynamic, interactive modules (like Polls or Moments) higher in the sequence boosts user daily engagement by up to 35%.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-3.5">
          <PolarisFormCard
            step={1}
            title="Module Prioritization Hierarchy"
            description="Drag and drop to reposition module feed items in the preferred display sequence."
            badge="Drag & Drop"
          >
            {/* Drag & Drop List */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="feed-sources">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {sources.map((source, index) => (
                      <Draggable
                        key={source.id || `source-${index}`}
                        draggableId={String(source.id || `source-${index}`)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "group relative flex items-center gap-2.5 p-2.5 rounded-[6px] border transition-all duration-200",
                              snapshot.isDragging
                                ? "bg-white dark:bg-zinc-900 border-[#303030] dark:border-zinc-100 shadow-md z-50 scale-[1.01]"
                                : "bg-[#f6f6f7]/50 dark:bg-zinc-900/50 border-[#d2d5d9] dark:border-zinc-800 hover:border-[#aeb4b9] hover:bg-[#f6f6f7]",
                            )}
                          >
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="p-1 rounded-[4px] text-[#616161] hover:text-[#303030] dark:hover:text-zinc-200 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical size={14} />
                            </div>

                            {/* Rank Indicator */}
                            <div className="flex items-center justify-center w-5 h-5 rounded-[4px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 text-[10px] font-bold text-[#303030] dark:text-zinc-300 tabular-nums">
                              {index + 1}
                            </div>

                            {/* Icon & Label */}
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <div className="w-7 h-7 rounded-[4px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center text-[#303030] dark:text-zinc-300 shrink-0">
                                <source.icon size={14} strokeWidth={2} />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 leading-tight">
                                  {source.label
                                    .replace("Show ", "")
                                    .replace(" in Feed", "")}
                                </h4>
                                <p className="text-[11px] text-[#616161] dark:text-zinc-400 truncate max-w-[340px] mt-0.5">
                                  {source.description}
                                </p>
                              </div>
                            </div>

                            {/* Status / Tags */}
                            <div className="flex items-center gap-2 shrink-0 pr-1">
                              {!source.enabled ? (
                                <span className="text-[9.5px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-[3px] border border-amber-500/20">
                                  Disabled in Config
                                </span>
                              ) : (
                                <span className="text-[9.5px] font-semibold text-[#616161] dark:text-zinc-400 bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 px-1.5 py-0.5 rounded-[3px]">
                                  Active
                                </span>
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
          </PolarisFormCard>

          {/* Floating Action Bar */}
          <FloatingSavePanel
            hasChanged={isDirty}
            saved={saved}
            isSaving={isSaving}
            onSave={handleSaveOrder}
            onReset={handleReset}
            title="Save Prioritization Order"
            description="You have modified the feed source sequence."
            buttonText="Save Sequence"
          />
        </div>
      </PolarisFormLayout>
    </div>
  );
};

export default FeedSourceOrdering;
