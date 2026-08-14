"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileQuestion, HelpCircle, Loader2, Sparkles } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useGetFaqByModule, useUpdateFaqByModule } from "@/graphql/actions/faq";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { FaqItem } from "./faq/faq-types";
import { FaqRow } from "./faq/faq-row";
import { FaqPreview } from "./faq/faq-preview";
import { FaqEditorDialog } from "./faq/faq-editor-dialog";
import { FaqDeleteDialog } from "./faq/faq-delete-dialog";
import {
  PolarisSidebarCard,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

interface ModuleFaqListManagerProps {
  moduleName: string;
  title?: string;
  description?: string;
}

export function ModuleFaqListManager({
  moduleName,
  title = "FAQ Management",
  description = "Manage frequently asked questions and knowledge base resources for your community.",
}: ModuleFaqListManagerProps) {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);

  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const { data, loading } = useGetFaqByModule({
    variables: { input: { module: moduleName } },
  });

  useEffect(() => {
    if (data?.getFaqByModule?.faq) {
      try {
        const parsed = JSON.parse(data.getFaqByModule.faq);
        setFaqItems(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setFaqItems([]);
      }
    }
  }, [data]);

  const [updateFaq, { loading: updating }] = useUpdateFaqByModule({
    module: moduleName,
    onCompleted: () => {
      toast.success("Knowledge base updated successfully.");
    },
  });

  const handleSave = async (items: FaqItem[]) => {
    try {
      await updateFaq({
        variables: { module: moduleName, faq: JSON.stringify(items) },
      });
    } catch (e) {}
  };

  const handleCreate = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setIsEditorOpen(true);
  };

  const handleEdit = (faq: FaqItem) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsEditorOpen(true);
  };

  const handleSaveItem = () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("Please fill in both question and answer fields.");
      return;
    }

    let updatedItems: FaqItem[];
    if (editingFaq) {
      updatedItems = faqItems.map((item) =>
        item.id === editingFaq.id ? { ...item, question, answer } : item,
      );
    } else {
      updatedItems = [
        ...faqItems,
        { id: `faq-${Date.now()}`, question, answer },
      ];
    }

    setFaqItems(updatedItems);
    handleSave(updatedItems);
    setIsEditorOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (faqToDelete) {
      const updatedItems = faqItems.filter(
        (item) => item.id !== faqToDelete.id,
      );
      setFaqItems(updatedItems);
      handleSave(updatedItems);
      setDeleteDialogOpen(false);
    }
  };

  const handleMoveFaq = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === faqItems.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newItems = [...faqItems];
    const temp = newItems[index];
    newItems[index] = newItems[newIndex];
    newItems[newIndex] = temp;

    setFaqItems(newItems);
    handleSave(newItems);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex === endIndex) return;

    const newItems = Array.from(faqItems);
    const [removed] = newItems.splice(startIndex, 1);
    newItems.splice(endIndex, 0, removed);

    setFaqItems(newItems);
    handleSave(newItems);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Sub-header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {title}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {description}
            </p>
          </div>
          <Button
            type="button"
            onClick={handleCreate}
            size="sm"
            className="h-9 px-4 text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add FAQ Entry
          </Button>
        </div>

        {/* 12-Col Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FAQ Entries List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Knowledge Entries ({faqItems.length})
              </span>
              <span className="text-[11px] text-zinc-400">
                Drag to reorder
              </span>
            </div>

            {faqItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/40 dark:bg-zinc-900/40 text-center">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
                  <FileQuestion size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                  No Knowledge Base Entries Yet
                </h3>
                <p className="text-[11px] text-zinc-400 max-w-xs mb-4">
                  Construct your module's frequently asked questions to guide community members.
                </p>
                <Button
                  type="button"
                  onClick={handleCreate}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-semibold border-zinc-200 dark:border-zinc-800"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Create First Entry
                </Button>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="faq-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid gap-2.5"
                    >
                      <AnimatePresence>
                        {faqItems.map((faq, index) => (
                          <Draggable
                            key={faq.id || `faq-${index}`}
                            draggableId={String(faq.id || `faq-${index}`)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={snapshot.isDragging ? "z-50" : ""}
                              >
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.98 }}
                                  transition={{ delay: index * 0.03 }}
                                >
                                  <FaqRow
                                    faq={faq}
                                    onEdit={() => handleEdit(faq)}
                                    onDelete={() => {
                                      setFaqToDelete(faq);
                                      setDeleteDialogOpen(true);
                                    }}
                                    onMoveUp={
                                      index > 0
                                        ? () => handleMoveFaq(index, "up")
                                        : undefined
                                    }
                                    onMoveDown={
                                      index < faqItems.length - 1
                                        ? () => handleMoveFaq(index, "down")
                                        : undefined
                                    }
                                    dragHandleProps={provided.dragHandleProps}
                                  />
                                </motion.div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </AnimatePresence>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Sticky Sidebar Live Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-6 space-y-6">
              <PolarisSidebarCard
                title="Client Accordion Preview"
                badge="Interactive"
                icon={Sparkles}
              >
                <FaqPreview faqItems={faqItems} />
              </PolarisSidebarCard>

              <PolarisTipCard title="Knowledge Base Guidance">
                Structure answers concisely with bullet points. Clear explanations reduce support inquiries by up to 40%.
              </PolarisTipCard>
            </div>
          </div>
        </div>
      </div>

      <FaqEditorDialog
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        editingFaq={!!editingFaq}
        question={question}
        setQuestion={setQuestion}
        answer={answer}
        setAnswer={setAnswer}
        onSave={handleSaveItem}
        isSaving={updating}
      />

      <FaqDeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
