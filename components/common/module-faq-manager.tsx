"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { 
  ModuleCard, 
  ModuleHeader, 
  ModuleStatusBar, 
  ModuleSectionLabel 
} from "./module-ui-kit";

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
  <div className="group/row relative flex items-start gap-4 p-5 transition-all duration-300 rounded-[24px] border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:border-indigo-100 shadow-sm/5 hover:shadow-xl hover:shadow-indigo-100/20 active:scale-[0.995]">
    {/* Drag Handle & Icon Stack */}
    <div className="flex items-center gap-3 shrink-0">
      <div className="flex flex-col gap-0.5 text-zinc-200 group-hover/row:text-zinc-300 transition-colors cursor-grab active:cursor-grabbing">
        <div className="w-1 h-1 rounded-full bg-current" />
        <div className="w-1 h-1 rounded-full bg-current" />
        <div className="w-1 h-1 rounded-full bg-current" />
      </div>
      <div className="w-12 h-12 rounded-[18px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover/row:bg-indigo-600 group-hover/row:text-white group-hover/row:border-indigo-500 transition-all duration-300 shadow-inner group-hover/row:shadow-indigo-200/50">
        <MessageCircleQuestion size={20} strokeWidth={2.5} />
      </div>
    </div>
    
    <div className="flex-1 min-w-0 pr-4 mt-0.5">
      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
        <h4 className="text-[14px] font-black tracking-tight text-zinc-900 group-hover/row:text-indigo-900 transition-colors leading-tight">
          {faq.question}
        </h4>
        <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100/50 flex items-center gap-1.5 shadow-sm">
          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          PUBLISHED
        </div>
        <div className="px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-400 text-[9px] font-bold tracking-tighter">
          ID: {faq.id.split('-')[1]?.substring(0,4) || 'X-00'}
        </div>
      </div>
      <div
        className="text-[12.5px] text-zinc-400 font-medium line-clamp-1 italic opacity-80 group-hover/row:opacity-100 transition-opacity"
        dangerouslySetInnerHTML={{
          __html: faq.answer.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
        }}
      />
    </div>

    <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-all translate-x-1 group-hover/row:translate-x-0 shrink-0 mt-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-9 w-9 rounded-xl text-zinc-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-zinc-100 shadow-sm transition-all"
      >
        <Edit size={14} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-9 w-9 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-zinc-100 shadow-sm transition-all"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  </div>
);


/* ─── Main Component ────────────────────────────────────────────────────── */
export function ModuleFaqListManager({
  moduleName,
  title = "FAQ Management",
  description = "Frequently asked questions for this module",
}: ModuleFaqListManagerProps) {
  const { toast } = useToast();
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);

  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Fetch FAQ data
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
      toast({ title: "FAQ Updated", description: "FAQ list successfully published." });
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
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
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

  if (loading) return null; // Let the layout or parent handle loading if needed, or add a spinner

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        <ModuleCard>
          <ModuleHeader
            title={title}
            description={description}
            icon={<HelpCircle size={24} strokeWidth={1.5} />}
            iconClassName="bg-zinc-900"
          >
            <Button 
              onClick={handleCreate} 
              className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl h-10 px-5 text-[13px] font-black shadow-xl shadow-zinc-200/50 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" strokeWidth={3} />
              CREATE NEW FAQ
            </Button>
          </ModuleHeader>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* List Area */}
              <div className="lg:col-span-7 space-y-5">
                <ModuleSectionLabel>Active Knowledge Base</ModuleSectionLabel>

                {faqItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 px-6 border-[1.5px] border-dashed border-zinc-200 rounded-[32px] bg-zinc-50/20 group hover:bg-zinc-50 transition-all duration-500">
                    <div className="w-16 h-16 rounded-[20px] bg-white shadow-lg flex items-center justify-center text-zinc-200 mb-6 group-hover:scale-110 transition-transform">
                      <FileQuestion size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-md font-black tracking-tight text-zinc-900 mb-1">No FAQs configured</h3>
                    <p className="text-[12px] text-zinc-400 text-center max-w-xs font-medium">
                      Help your users find answers instantly by creating your first FAQ entry.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <AnimatePresence>
                      {faqItems.map((faq, index) => (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ delay: index * 0.04 }}
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
              <div className="lg:col-span-5 sticky top-8">
                <ModuleSectionLabel>End-User Live Preview</ModuleSectionLabel>
                
                <div className="mt-4 ring-1 ring-zinc-200/60 rounded-[32px] bg-zinc-50/30 p-1 shadow-inner-sm">
                  <div className="bg-white rounded-[31px] shadow-2xl shadow-zinc-200/50 overflow-hidden ring-1 ring-white">
                    <div className="bg-zinc-50/80 p-5 flex items-center justify-between border-b border-zinc-100">
                      <div className="flex gap-1.5 px-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                      </div>
                      <Eye size={14} className="text-zinc-300" />
                    </div>
                    <div className="p-8 min-h-[300px]">
                      {faqItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale">
                          <Search size={32} strokeWidth={1} className="mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Void View</p>
                        </div>
                      ) : (
                        <Accordion type="single" collapsible className="w-full space-y-2.5">
                          {faqItems.map((faq) => (
                            <AccordionItem 
                              key={faq.id} 
                              value={faq.id} 
                              className="border-0 bg-zinc-50/80 rounded-[20px] px-5 transition-all data-[state=open]:bg-indigo-50/80 data-[state=open]:ring-2 data-[state=open]:ring-indigo-100/50"
                            >
                              <AccordionTrigger className="text-[13.5px] font-bold text-zinc-800 hover:no-underline py-4 text-left leading-tight">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-[12.5px] text-zinc-500 font-medium leading-relaxed pb-5 pt-1">
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
              </div>
            </div>
          </CardContent>

          <ModuleStatusBar label="End-User Experience Verified" />
        </ModuleCard>
      </div>

      {/* FAQ Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0 rounded-[40px] border-0 shadow-3xl ring-1 ring-black/5">
          <DialogHeader className="p-10 border-b bg-zinc-50/30 flex-none">
            <div className="flex items-center gap-5 mb-2">
              <div className="w-12 h-12 rounded-[18px] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                <Edit size={24} strokeWidth={2} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tighter text-zinc-900 leading-none mb-1">
                  {editingFaq ? "Refine Entry" : "Craft New Entry"}
                </DialogTitle>
                <DialogDescription className="text-zinc-400 font-semibold text-[13px] tracking-tight">
                  Precision knowledge management for your module's ecosystem.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-10 space-y-8 overflow-y-auto flex-1 custom-scrollbar bg-white">
            <div className="space-y-4">
              <div className="px-1 flex items-center justify-between">
                <Label htmlFor="question" className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
                  Target Question
                </Label>
                <span className="text-[10px] font-bold text-indigo-500/50 tracking-tighter uppercase italic">Primary Anchor</span>
              </div>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What exactly is the question?"
                className="h-16 px-6 text-xl font-bold tracking-tight text-zinc-900 rounded-[20px] bg-zinc-50/80 border-transparent focus-visible:bg-white focus-visible:border-indigo-200 focus-visible:ring-8 focus-visible:ring-indigo-50/50 transition-all placeholder:text-zinc-300 shadow-inner group-focus-within:shadow-none"
              />
            </div>

            <div className="space-y-4">
              <div className="px-1 flex items-center justify-between">
                <Label className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
                  Detailed Intelligence
                </Label>
                <span className="text-[10px] font-bold text-emerald-500/50 tracking-tighter uppercase italic">Verified Data</span>
              </div>
              <div className="rounded-[24px] border border-zinc-100 overflow-hidden shadow-inner bg-zinc-50/20 ring-1 ring-zinc-50 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                <RichTextEditor
                  value={answer}
                  onChange={setAnswer}
                  placeholder="Elaborate with precision..."
                  minHeight="350px"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-10 border-t flex items-center justify-between sm:justify-between bg-zinc-50/30 flex-none">
            <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Intelligence Core Secure
            </div>
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setIsEditorOpen(false)} 
                className="rounded-2xl h-12 px-6 font-bold text-zinc-400 hover:text-zinc-600 hover:bg-white"
              >
                CANCEL Changes
              </Button>
              <Button 
                onClick={handleSaveItem} 
                disabled={updating}
                className="bg-zinc-950 hover:bg-black text-white rounded-[20px] h-12 px-10 text-[14px] font-black transition-all shadow-2xl shadow-zinc-400 active:scale-95 border-b-2 border-zinc-700"
              >
                {updating ? (
                   <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} className="mr-2.5" strokeWidth={2.5} />
                    {editingFaq ? "UPDATE ENTRY" : "PUBLISH ENTRY"}
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[40px] border-0 shadow-3xl">
          <div className="p-10 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mx-auto shadow-inner">
              <Trash2 size={40} strokeWidth={2} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black tracking-tighter text-zinc-900">Purge Entry?</DialogTitle>
              <DialogDescription className="text-zinc-500 font-semibold px-4 tracking-tight leading-relaxed">
                This FAQ data will be removed from your knowledge base instantly. This action is definitive.
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="p-8 bg-zinc-50/50 flex gap-4 mt-2">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="flex-1 h-14 rounded-2xl font-black bg-white text-zinc-400 border border-zinc-100 shadow-sm">
              ABORT
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="flex-1 h-14 rounded-2xl font-black shadow-xl shadow-red-100 border-b-2 border-red-800">
              DELETE NOW
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 20px; }
        .shadow-3xl { filter: drop-shadow(0 40px 100px rgba(0,0,0,0.15)); }
      `}</style>
    </>
  );
}
