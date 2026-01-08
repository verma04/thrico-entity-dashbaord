import React, { useState } from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { ModuleContainer } from "../modules/module-container";

interface FaqRendererProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

export const FaqRenderer = ({
  module,
  previewDevice = "desktop",
}: FaqRendererProps) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const questions = content.questions ||
    content.faqs || [
      {
        question: "What is your return policy?",
        answer:
          "You can return any unused item within 30 days of purchase for a full refund.",
      },
      {
        question: "Do you offer international shipping?",
        answer:
          "Yes, we ship to over 100 countries worldwide. Shipping rates vary by location.",
      },
      {
        question: "How can I contact support?",
        answer:
          "Our support team is available 24/7 via email at support@example.com.",
      },
    ];

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      {layout !== "highlight-feature" && (
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">
            {content.title || "Frequently Asked Questions"}
          </h2>
          <p className="text-xl text-muted-foreground">
            {content.subtitle ||
              "Everything you need to know about the product and billing."}
          </p>
        </div>
      )}

      {/* 1. SIMPLE ACCORDION */}
      {layout === "simple-accordion" && (
        <div className="max-w-3xl mx-auto divide-y">
          {questions.map((item: any, idx: number) => (
            <AccordionItem
              key={idx}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      )}

      {/* 2. GRID CARDS */}
      {layout === "grid-cards" && (
        <div
          className={cn(
            "grid gap-6",
            !isMobile && "grid-cols-2 lg:grid-cols-3"
          )}
        >
          {questions.map((item: any, idx: number) => (
            <div
              key={idx}
              className="bg-muted/20 border rounded-2xl p-8 hover:shadow-lg transition-all hover:bg-muted/40 group"
            >
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg mb-3">{item.question}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 3. HIGHLIGHT FEATURE */}
      {layout === "highlight-feature" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start max-w-7xl mx-auto px-6 py-12">
          {/* Sidebar Content */}
          <div className="lg:col-span-4 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center p-4 bg-slate-900 text-white rounded-4xl shadow-xl shadow-slate-200">
              <HelpCircle className="h-8 w-8" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {content.sidebarTitle || "Still have questions?"}
              </h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {content.sidebarSubtitle ||
                  "Can't find the answer you're looking for? Our friendly team is here to help you 24/7."}
              </p>
            </div>
            <div className="pt-4">
              <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all hover:translate-x-1 group">
                {content.sidebarButtonText || "Get in touch"}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-8 space-y-6">
            {questions.map((item: any, idx: number) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group"
              >
                <h4 className="font-bold text-xl text-slate-900 mb-3 flex items-start gap-4">
                  <span className="text-slate-200 font-black text-2xl group-hover:text-slate-900 transition-colors duration-500">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  {item.question}
                </h4>
                <p className="text-slate-500 text-lg leading-relaxed font-medium pl-10">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};

const AccordionItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">
          {question}
        </span>
        <span
          className={cn(
            "ml-6 flex items-center justify-center h-8 w-8 rounded-full border transition-all",
            isOpen
              ? "bg-primary border-primary text-white rotate-180"
              : "bg-transparent text-muted-foreground"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-muted-foreground leading-relaxed pr-12">{answer}</p>
      </div>
    </div>
  );
};
