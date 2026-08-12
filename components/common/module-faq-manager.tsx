"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileQuestion, HelpCircle, Loader2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useGetFaqByModule, useUpdateFaqByModule } from "@/graphql/actions/faq";
import { CtaButton } from "@/components/ui/cta-button";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { toast } from "sonner";

import { FaqItem } from "./faq/faq-types";
import { FaqRow } from "./faq/faq-row";
import { FaqPreview } from "./faq/faq-preview";
import { FaqEditorDialog } from "./faq/faq-editor-dialog";
import { FaqDeleteDialog } from "./faq/faq-delete-dialog";

interface ModuleFaqListManagerProps {
  moduleName: string;
  title?: string;
  description?: string;
}

export function ModuleFaqListManager({
  moduleName,
  title = "FAQ Management",
  description = "Manage frequently asked questions for this module's knowledge base.",
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
      toast.error("Please fill in all fields.");
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-200" />
      </div>
    );
  }

  return (
    <>
      <EcosystemWrapper className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <EcosystemHeader
          title={title}
          description={description}
          icon={HelpCircle}
          actions={
            <CtaButton onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Entry
            </CtaButton>
          }
        />

        <EcosystemContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List Area */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Knowledge Repository
            </h3>

            {faqItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-zinc-200 rounded-[24px] bg-zinc-50/20 group hover:bg-zinc-50 transition-all duration-500">
                <div className="w-12 h-12 rounded-[16px] bg-white border border-zinc-100 flex items-center justify-center text-zinc-300 mb-6 group-hover:scale-110 transition-transform">
                  <FileQuestion size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold tracking-tight text-zinc-900 mb-1">
                  No Entries Yet
                </h3>
                <p className="text-[12px] text-zinc-400 text-center max-w-xs font-medium">
                  Construct your module's knowledge base to assist end-users.
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="faq-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid gap-3"
                    >
                      <AnimatePresence>
                        {faqItems.map((faq, index) => (
                          <Draggable key={faq.id} draggableId={faq.id} index={index}>
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
                                      index > 0 ? () => handleMoveFaq(index, "up") : undefined
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

          {/* Preview Area */}
          <div className="lg:col-span-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Client Interface Preview
            </h3>

            <FaqPreview faqItems={faqItems} />
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>

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
