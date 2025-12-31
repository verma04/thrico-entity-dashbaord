"use client";

import React, { useState } from "react";
import { FaqItem } from "@/types/faq-types";
import { FaqFilters } from "@/components/faq/faq-filters";
import { FaqList } from "@/components/faq/faq-list";
import { FaqEditor } from "@/components/faq/faq-editor";
import { FaqPreview } from "@/components/faq/faq-preview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function FaqPage() {
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleEdit = (faq: FaqItem) => {
    setSelectedFaq(faq);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedFaq(null);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedFaq(null);
  };

  return (
    <div className="space-y-6">
      {/* Filters & Create Button */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your FAQs</h2>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create FAQ
          </Button>
        </div>

        <FaqFilters />
      </div>

      {/* FAQ List & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>FAQ List</CardTitle>
              <CardDescription>Manage and organize your FAQs</CardDescription>
            </CardHeader>
            <CardContent>
              <FaqList onEdit={handleEdit} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your FAQs will look to users
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 bg-muted/20 border-t">
                <FaqPreview />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Editor */}
      <FaqEditor
        faq={selectedFaq}
        open={isEditorOpen}
        onOpenChange={handleCloseEditor}
      />
    </div>
  );
}
