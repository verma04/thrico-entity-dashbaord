"use client";

import React, { useState } from "react";
import { FaqItem } from "@/types/faq-types";
import { useFaqStore } from "@/store/useFaqStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, GripVertical, FileQuestion, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqListProps {
  onEdit: (faq: FaqItem) => void;
}

export const FaqList: React.FC<FaqListProps> = ({ onEdit }) => {
  const { getFilteredFaqs, deleteFaq, toggleFaqStatus, categories } = useFaqStore();
  const faqs = getFilteredFaqs();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);

  const handleDeleteClick = (faq: FaqItem) => {
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (faqToDelete) {
      deleteFaq(faqToDelete.id);
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  if (faqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg bg-muted/10">
        <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {categories.length === 0
            ? "Create a category first, then add FAQs to it."
            : "Create your first FAQ to help users find answers quickly."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className={cn(
              "flex items-start gap-3 p-4 border rounded-lg bg-card transition-colors",
              faq.isActive ? "hover:bg-muted/50" : "opacity-60"
            )}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab mt-1" />

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h4 className="font-semibold flex-1">{faq.question}</h4>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={faq.isActive ? "default" : "secondary"}>
                    {faq.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{getCategoryName(faq.categoryId)}</Badge>
                </div>
              </div>

              <div
                className="text-sm text-muted-foreground line-clamp-2 mb-2"
                dangerouslySetInnerHTML={{
                  __html: faq.answer.replace(/<[^>]*>/g, "").substring(0, 150),
                }}
              />

              {faq.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {faq.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                    >
                      <Tag className="h-2 w-2" />
                      {tag}
                    </span>
                  ))}
                  {faq.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{faq.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Label htmlFor={`status-${faq.id}`} className="text-sm sr-only">
                  Active
                </Label>
                <Switch
                  id={`status-${faq.id}`}
                  checked={faq.isActive}
                  onCheckedChange={() => toggleFaqStatus(faq.id)}
                />
              </div>

              <Button variant="ghost" size="icon" onClick={() => onEdit(faq)}>
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete FAQ</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{faqToDelete?.question}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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
};
