"use client";

import React, { useState } from "react";
import { useFaqStore } from "@/store/useFaqStore";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const FaqPreview: React.FC = () => {
  const { selectedLayout, categories, faqs } = useFaqStore();
  
  // All hooks must be called at the top, before any conditional logic
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // Only show active FAQs in active categories
  const activeFaqs = faqs.filter((f) => f.isActive);
  const activeCategories = categories.filter((c) => c.isActive);

  // Initialize states after we have the data
  React.useEffect(() => {
    if (activeFaqs.length > 0 && !selectedFaqId) {
      setSelectedFaqId(activeFaqs[0].id);
    }
  }, [activeFaqs, selectedFaqId]);

  React.useEffect(() => {
    if (activeCategories.length > 0 && expandedCategories.size === 0) {
      setExpandedCategories(new Set([activeCategories[0]?.id]));
    }
  }, [activeCategories, expandedCategories.size]);

  if (activeFaqs.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground">
            No active FAQs to preview. Create some FAQs and make sure they're active.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Accordion Layout (Default)
  if (selectedLayout === "accordion") {
    return (
      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {activeFaqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                  {faq.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {faq.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    );
  }

  // Grid Cards Layout
  if (selectedLayout === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeFaqs.map((faq) => (
          <Card key={faq.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
              <div
                className="prose prose-sm max-w-none dark:prose-invert line-clamp-4"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
              {faq.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {faq.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Tabbed Categories Layout
  if (selectedLayout === "tabs") {
    return (
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue={activeCategories[0]?.id} className="w-full">
            <TabsList className="mb-6">
              {activeCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeCategories.map((category) => {
              const categoryFaqs = activeFaqs.filter((f) => f.categoryId === category.id);

              return (
                <TabsContent key={category.id} value={category.id}>
                  <Accordion type="single" collapsible>
                    {categoryFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  // Two Column Layout
  if (selectedLayout === "two-column") {
    const selectedFaq = activeFaqs.find((f) => f.id === selectedFaqId);

    return (
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-x min-h-[500px]">
            {/* Questions Column */}
            <div className="p-6 space-y-2 overflow-y-auto max-h-[600px]">
              <h3 className="font-semibold mb-4">Questions</h3>
              {activeFaqs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => setSelectedFaqId(faq.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    selectedFaqId === faq.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <p className="font-medium">{faq.question}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {categories.find((c) => c.id === faq.categoryId)?.name}
                  </p>
                </button>
              ))}
            </div>

            {/* Answer Column */}
            <div className="p-6 overflow-y-auto max-h-[600px]">
              {selectedFaq ? (
                <>
                  <h3 className="font-semibold text-lg mb-4">{selectedFaq.question}</h3>
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: selectedFaq.answer }}
                  />
                  {selectedFaq.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {selectedFaq.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground text-center py-16">
                  Select a question to view the answer
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Nested/Hierarchical Layout
  if (selectedLayout === "nested") {
    const toggleCategory = (categoryId: string) => {
      const newExpanded = new Set(expandedCategories);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      setExpandedCategories(newExpanded);
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {activeCategories.map((category) => {
              const categoryFaqs = activeFaqs.filter((f) => f.categoryId === category.id);
              const isExpanded = expandedCategories.has(category.id);

              return (
                <div key={category.id} className="border rounded-lg">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-2 p-4 hover:bg-muted/50 transition-colors rounded-t-lg"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                    <h3 className="font-semibold text-lg flex-1 text-left">
                      {category.name}
                    </h3>
                    <Badge variant="outline">{categoryFaqs.length} FAQs</Badge>
                  </button>

                  {isExpanded && (
                    <div className="border-t">
                      <Accordion type="single" collapsible className="px-4">
                        {categoryFaqs.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div
                                className="prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
