"use client";

import React, { useState } from "react";
import { FaqItem } from "@/types/faq-types";
import { CategoryManager } from "@/components/faq/category-manager";
import { FaqFilters } from "@/components/faq/faq-filters";
import { FaqList } from "@/components/faq/faq-list";
import { FaqEditor } from "@/components/faq/faq-editor";
import { FaqLayoutSelector } from "@/components/faq/faq-layout-selector";
import { FaqPreview } from "@/components/faq/faq-preview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, HelpCircle, FolderTree } from "lucide-react";

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">FAQ Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage frequently asked questions and categories
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="faqs" className="flex-1">
        <TabsList className="mb-6">
          <TabsTrigger value="faqs" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Manage FAQs
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderTree className="h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6">
          {/* Layout Selector */}
          <FaqLayoutSelector />

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

          {/* FAQ List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>FAQ List</CardTitle>
                  <CardDescription>
                    Manage and organize your FAQs
                  </CardDescription>
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
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>
      </Tabs>

      {/* FAQ Editor */}
      <FaqEditor faq={selectedFaq} open={isEditorOpen} onOpenChange={handleCloseEditor} />
    </div>
  );
}
