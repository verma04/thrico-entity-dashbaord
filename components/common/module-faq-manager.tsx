"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2, FileQuestion } from "lucide-react";
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
import { Loader2, Save } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export function ModuleFaqListManager({
  moduleName,
  title = "FAQ Management",
  description = "Manage frequently asked questions for this module",
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
    variables: {
      input: {
        module: moduleName,
      },
    },
  });

  // Update FAQ items when data is loaded
  useEffect(() => {
    if (data?.getFaqByModule?.faq) {
      try {
        const parsed = JSON.parse(data.getFaqByModule.faq);
        setFaqItems(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Error parsing FAQ data:", error);
        setFaqItems([]);
      }
    }
  }, [data]);

  // Update FAQ mutation
  const [updateFaq, { loading: updating }] = useUpdateFaqByModule({
    module: moduleName,
    onCompleted: () => {
      toast({
        title: "FAQ Updated",
        description: "FAQ list has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update FAQ list.",
        variant: "destructive",
      });
    },
  });

  const handleSave = async (items: FaqItem[]) => {
    try {
      await updateFaq({
        variables: {
          module: moduleName,
          faq: JSON.stringify(items),
        },
      });
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
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
      toast({
        title: "Validation Error",
        description: "Question and answer are required.",
        variant: "destructive",
      });
      return;
    }

    let updatedItems: FaqItem[];

    if (editingFaq) {
      // Update existing
      updatedItems = faqItems.map((item) =>
        item.id === editingFaq.id ? { ...item, question, answer } : item
      );
    } else {
      // Create new
      const newItem: FaqItem = {
        id: `faq-${Date.now()}`,
        question,
        answer,
      };
      updatedItems = [...faqItems, newItem];
    }

    setFaqItems(updatedItems);
    handleSave(updatedItems);
    setIsEditorOpen(false);
    setQuestion("");
    setAnswer("");
    setEditingFaq(null);
  };

  const handleDeleteClick = (faq: FaqItem) => {
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (faqToDelete) {
      const updatedItems = faqItems.filter(
        (item) => item.id !== faqToDelete.id
      );
      setFaqItems(updatedItems);
      handleSave(updatedItems);
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create FAQ
          </Button>
        </div>

        {/* FAQ List & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAQ List */}
          <Card>
            <CardHeader>
              <CardTitle>FAQ List</CardTitle>
              <CardDescription>Manage and organize your FAQs</CardDescription>
            </CardHeader>
            <CardContent>
              {faqItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg bg-muted/10">
                  <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    Create your first FAQ to help users find answers quickly.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {faqItems.map((faq) => (
                    <div
                      key={faq.id}
                      className="flex items-start gap-3 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-2">{faq.question}</h4>
                        <div
                          className="text-sm text-muted-foreground line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: faq.answer
                              .replace(/<[^>]*>/g, "")
                              .substring(0, 150),
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(faq)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(faq)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your FAQs will look to users
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 bg-muted/20 border-t">
                {faqItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No FAQs to preview
                  </p>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFaq ? "Edit FAQ" : "Create New FAQ"}
            </DialogTitle>
            <DialogDescription>
              {editingFaq
                ? "Update the FAQ question and answer below."
                : "Add a new frequently asked question."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">
                Question <span className="text-destructive">*</span>
              </Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What is your question?"
                className="text-lg font-semibold"
              />
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <Label>
                Answer <span className="text-destructive">*</span>
              </Label>
              <RichTextEditor
                value={answer}
                onChange={setAnswer}
                placeholder="Provide a detailed answer..."
                minHeight="300px"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingFaq ? "Update" : "Create"} FAQ
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete FAQ</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{faqToDelete?.question}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
