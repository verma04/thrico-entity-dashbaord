"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileQuestion, 
  Search, 
  Eye, 
  MessageCircleQuestion,
  HelpCircle,
  Save,
  Loader2,
  ChevronDown
} from "lucide-react";
import { useGetFaqByModule, useUpdateFaqByModule } from "@/graphql/actions/faq";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlatformCard, PlatformSection } from "@/components/ui/platform/card";
import { PlatformHeader } from "@/components/ui/platform/header";
import { PlatformButton } from "@/components/ui/platform/button";
import { PlatformGrid } from "@/components/ui/platform/container";
import { PlatformSectionLabel } from "@/components/ui/platform/settings";
import { toast } from "sonner";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ModuleFaqListManagerProps {
  moduleName: string;
  title?: string;
  description?: string;
}

/* ─── FAQ Row Component ─────────────────────────────────────────────────── */
const FaqRow = ({ 
  faq, 
  onEdit, 
  onDelete 
}: { 
  faq: FaqItem; 
  onEdit: () => void; 
  onDelete: () => void;
}) => (
  <div className="group relative flex items-start gap-4 p-4 transition-all duration-300 rounded-[16px] border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-1">
        <h4 className="text-[14px] font-semibold tracking-tight text-zinc-900 leading-snug">
          {faq.question}
        </h4>
        <div className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[9px] font-bold tracking-wider uppercase border border-zinc-200/50">
          ID: {faq.id.split('-')[1]?.substring(0,4) || 'X-00'}
        </div>
      </div>
      <div
        className="text-[13px] text-zinc-400 font-medium line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity"
        dangerouslySetInnerHTML={{
          __html: faq.answer.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
        }}
      />
    </div>

    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
      <PlatformButton
        variant="ghost"
        size="icon"
        onClick={onEdit}
        icon={Edit}
        className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
      />
      <PlatformButton
        variant="ghost"
        size="icon"
        onClick={onDelete}
        icon={Trash2}
        className="h-8 w-8 text-zinc-400 hover:text-red-500"
      />
    </div>
  </div>
);


/* ─── Main Component ────────────────────────────────────────────────────── */
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
        item.id === editingFaq.id ? { ...item, question, answer } : item
      );
    } else {
      updatedItems = [...faqItems, { id: `faq-${Date.now()}`, question, answer }];
    }

    setFaqItems(updatedItems);
    handleSave(updatedItems);
    setIsEditorOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (faqToDelete) {
      const updatedItems = faqItems.filter((item) => item.id !== faqToDelete.id);
      setFaqItems(updatedItems);
      handleSave(updatedItems);
      setDeleteDialogOpen(false);
    }
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
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <PlatformHeader
          title={title}
          description={description}
          icon={HelpCircle}
          actions={
            <PlatformButton onClick={handleCreate} icon={Plus}>
              Create Entry
            </PlatformButton>
          }
        />

        <PlatformGrid cols={12} gap="lg">
          {/* List Area */}
          <div className="lg:col-span-7 space-y-6">
            <PlatformSectionLabel>KNOWLEDGE REPOSITORY</PlatformSectionLabel>

            {faqItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-zinc-200 rounded-[24px] bg-zinc-50/20 group hover:bg-zinc-50 transition-all duration-500">
                <div className="w-12 h-12 rounded-[16px] bg-white border border-zinc-100 flex items-center justify-center text-zinc-300 mb-6 group-hover:scale-110 transition-transform">
                  <FileQuestion size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold tracking-tight text-zinc-900 mb-1">No Entries Yet</h3>
                <p className="text-[12px] text-zinc-400 text-center max-w-xs font-medium">
                  Construct your module's knowledge base to assist end-users.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                <AnimatePresence>
                  {faqItems.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <FaqRow 
                        faq={faq} 
                        onEdit={() => handleEdit(faq)} 
                        onDelete={() => { setFaqToDelete(faq); setDeleteDialogOpen(true); }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-5">
            <PlatformSectionLabel>CLIENT INTERFACE PREVIEW</PlatformSectionLabel>
            
            <div className="mt-4 ring-1 ring-zinc-200/50 rounded-[24px] bg-zinc-50/50 p-6 shadow-sm min-h-[400px]">
              <div className="max-w-md mx-auto space-y-4">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900">FAQ</h2>
                {faqItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Search size={32} strokeWidth={1.5} className="mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Preview Data Empty</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {faqItems.map((faq) => (
                      <AccordionItem 
                        key={faq.id} 
                        value={faq.id} 
                        className="border border-zinc-200/50 bg-white rounded-[12px] px-4 overflow-hidden transition-all data-[state=open]:ring-2 data-[state=open]:ring-zinc-100"
                      >
                        <AccordionTrigger className="text-[14px] font-medium text-zinc-900 hover:no-underline py-4 text-left leading-tight group">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-[13px] text-zinc-500 font-medium leading-relaxed pb-5">
                          <div
                            className="prose prose-sm prose-zinc max-w-none"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </PlatformGrid>
      </div>

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-3xl flex flex-col p-0 rounded-[24px] border-0 shadow-2xl overflow-hidden">
          <DialogHeader className="px-8 py-6 border-b bg-zinc-50/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-[12px] bg-zinc-900 flex items-center justify-center text-white">
                <Edit size={20} strokeWidth={1.5} />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold tracking-tight text-zinc-900 leading-none mb-1">
                  {editingFaq ? "Refine FAQ Entry" : "New FAQ Entry"}
                </DialogTitle>
                <DialogDescription className="text-zinc-400 font-medium text-[13px] tracking-tight">
                  Precisely define information for your module's end-users.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-6 bg-white overflow-y-auto max-h-[60vh]">
            <div className="space-y-3">
              <Label htmlFor="question" className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                The Question
              </Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What exactly is being asked?"
                className="h-12 px-4 text-md font-medium tracking-tight text-zinc-900 rounded-[12px] bg-zinc-50/80 border-transparent focus-visible:bg-white focus-visible:border-zinc-200 transition-all placeholder:text-zinc-300"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                The Solution
              </Label>
              <div className="rounded-[16px] border border-zinc-100 overflow-hidden shadow-inner bg-zinc-50/20">
                <RichTextEditor
                  value={answer}
                  onChange={setAnswer}
                  placeholder="Provide clarity..."
                  minHeight="300px"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-8 py-6 border-t bg-zinc-50/50">
            <div className="flex w-full items-center justify-between">
              <div className="text-[10px] font-medium text-zinc-400 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                DRAFT SECURE
              </div>
              <div className="flex gap-3">
                <PlatformButton 
                  variant="ghost" 
                  onClick={() => setIsEditorOpen(false)} 
                >
                  Discard
                </PlatformButton>
                <PlatformButton 
                  onClick={handleSaveItem} 
                  isLoading={updating}
                  icon={Save}
                >
                  {editingFaq ? "Update" : "Publish"}
                </PlatformButton>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md p-10 rounded-[24px] border-0 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mx-auto">
            <Trash2 size={32} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-900">Purge Entry?</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium tracking-tight px-4 leading-relaxed">
              This action will permanently remove this entry from your module's knowledge base.
            </DialogDescription>
          </div>
          <DialogFooter className="flex gap-3 pt-4">
            <PlatformButton variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="flex-1">
              Keep
            </PlatformButton>
            <PlatformButton variant="destructive" onClick={handleDeleteConfirm} className="flex-1 bg-red-600 hover:bg-red-700">
              Delete
            </PlatformButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

