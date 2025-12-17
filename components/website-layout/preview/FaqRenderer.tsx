import React, { useState } from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

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

  const questions = content.questions || [
    { question: "What is your return policy?", answer: "You can return any unused item within 30 days of purchase for a full refund." },
    { question: "Do you offer international shipping?", answer: "Yes, we ship to over 100 countries worldwide. Shipping rates vary by location." },
    { question: "How can I contact support?", answer: "Our support team is available 24/7 via email at support@example.com." },
  ];

  return (
    <div className="py-20 px-4 sm:px-6 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold tracking-tight">{content.title || "Frequently Asked Questions"}</h2>
            <p className="text-xl text-muted-foreground">{content.subtitle || "Everything you need to know about the product and billing."}</p>
        </div>

        {/* 1. SIMPLE ACCORDION */}
        {layout === "simple-accordion" && (
            <div className="max-w-3xl mx-auto divide-y">
                {questions.map((item: any, idx: number) => (
                    <AccordionItem key={idx} question={item.question} answer={item.answer} />
                ))}
            </div>
        )}

        {/* 2. GRID CARDS */}
        {layout === "grid-cards" && (
            <div className={cn("grid gap-6", !isMobile && "grid-cols-2 lg:grid-cols-3")}>
                 {questions.map((item: any, idx: number) => (
                    <div key={idx} className="bg-muted/20 border rounded-2xl p-8 hover:shadow-lg transition-all hover:bg-muted/40 group">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <HelpCircle className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-lg mb-3">{item.question}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                 ))}
            </div>
        )}

        {/* 3. HIGHLIGHT FEATURE */}
        {layout === "highlight-feature" && (
            <div className={cn("grid gap-12", !isMobile && "grid-cols-12")}>
                <div className={cn("lg:col-span-4 space-y-6", isMobile && "text-center")}>
                    <div className="bg-primary/5 text-primary p-6 rounded-2xl inline-block">
                        <HelpCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold">Still have questions?</h3>
                    <p className="text-muted-foreground">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90">
                        Get in touch
                    </button>
                </div>
                <div className="lg:col-span-8 space-y-4">
                    {questions.map((item: any, idx: number) => (
                         <div key={idx} className="bg-card border rounded-lg p-6 hover:border-primary/50 transition-colors">
                            <h4 className="font-semibold text-lg mb-2">{item.question}</h4>
                            <p className="text-muted-foreground">{item.answer}</p>
                         </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="py-6">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left group"
            >
                <span className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">{question}</span>
                <span className={cn("ml-6 flex items-center justify-center h-8 w-8 rounded-full border transition-all", isOpen ? "bg-primary border-primary text-white rotate-180" : "bg-transparent text-muted-foreground")}>
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
    )
}
