import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  HelpCircle,
  Layout,
  MessageSquare,
  GripVertical,
  Settings2,
} from "lucide-react";

interface FaqSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const FaqSettings: React.FC<FaqSettingsProps> = ({
  content,
  onChange,
}) => {
  const questions = content.questions || content.faqs || [];

  const updateQuestion = (index: number, updates: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange({ questions: newQuestions });
  };

  const addQuestion = (
    question: string = "",
    answer: string = "",
    category: string = ""
  ) => {
    onChange({ questions: [...questions, { question, answer, category }] });
  };

  const removeQuestion = (index: number) => {
    onChange({
      questions: questions.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Section Header */}
      <div className="space-y-4">
        <Label className="text-xs uppercase font-black text-blue-600 tracking-widest flex items-center gap-2">
          <Layout className="w-3 h-3" />
          General FAQ Info
        </Label>
        <div className="space-y-4 p-4 bg-muted/50 rounded-2xl border border-border">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Section Title
            </Label>
            <Input
              value={content.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Frequently Asked Questions"
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Section Subtitle
            </Label>
            <Textarea
              value={content.subtitle || ""}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder="Everything you need to know about the product and billing."
              className="min-h-[80px] rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sidebar Settings (Specific to highlight-feature layout) */}
      <div className="space-y-4">
        <Label className="text-xs uppercase font-black text-indigo-600 tracking-widest flex items-center gap-2">
          <Settings2 className="w-3 h-3" />
          Highlight Layout Sidebar
        </Label>
        <div className="space-y-4 p-4 bg-muted/50 rounded-2xl border border-border">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Sidebar Title
            </Label>
            <Input
              value={content.sidebarTitle || ""}
              onChange={(e) => onChange({ sidebarTitle: e.target.value })}
              placeholder="Still have questions?"
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Sidebar Subtitle
            </Label>
            <Textarea
              value={content.sidebarSubtitle || ""}
              onChange={(e) => onChange({ sidebarSubtitle: e.target.value })}
              placeholder="Can't find the answer you're looking for? Our friendly team is here to help you 24/7."
              className="min-h-[80px] rounded-xl text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Button Text
            </Label>
            <Input
              value={content.sidebarButtonText || ""}
              onChange={(e) => onChange({ sidebarButtonText: e.target.value })}
              placeholder="Get in touch"
              className="h-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-black text-blue-600 tracking-widest flex items-center gap-2">
            <HelpCircle className="w-3 h-3" />
            FAQ Items
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addQuestion()}
            className="h-8 rounded-full text-[10px] font-bold uppercase"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((faq: any, index: number) => (
            <div
              key={index}
              className="group p-5 bg-card border rounded-2xl shadow-sm space-y-4 transition-all hover:shadow-md relative"
            >
              <div className="flex justify-between items-center border-b pb-3 mb-2">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                  <GripVertical className="w-3 h-3 text-muted-foreground" />
                  Question {index + 1}
                </span>
                <button
                  onClick={() => removeQuestion(index)}
                  className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Question
                  </Label>
                  <Input
                    value={faq.question || ""}
                    onChange={(e) =>
                      updateQuestion(index, { question: e.target.value })
                    }
                    placeholder="How do I get started?"
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Answer
                  </Label>
                  <Textarea
                    value={faq.answer || ""}
                    onChange={(e) =>
                      updateQuestion(index, { answer: e.target.value })
                    }
                    placeholder="To get started, simply..."
                    className="min-h-[100px] rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Category (Optional)
                  </Label>
                  <Input
                    value={faq.category || ""}
                    onChange={(e) =>
                      updateQuestion(index, { category: e.target.value })
                    }
                    placeholder="General, Billing, Technical"
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-12 bg-muted/50 rounded-3xl border border-dashed border-border">
              <HelpCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">
                No questions yet. Add your first FAQ to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Templates */}
      <div className="space-y-4">
        <Label className="text-xs uppercase font-black text-amber-600 tracking-widest flex items-center gap-2">
          <MessageSquare className="w-3 h-3" />
          Quick Templates
        </Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              label: "Account Creation",
              question: "How do I create an account?",
              answer:
                "To create an account, click the 'Sign Up' button and follow the registration process. You'll need to provide your email address and create a secure password.",
            },
            {
              label: "Payment Methods",
              question: "What payment methods do you accept?",
              answer:
                "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for applicable plans.",
            },
            {
              label: "Contact Support",
              question: "How can I contact support?",
              answer:
                "You can reach our support team through email, live chat, or by submitting a support ticket. We're here to help 24/7.",
            },
            {
              label: "Data Security",
              question: "Is my data secure?",
              answer:
                "Yes, we use industry-standard encryption and security measures to protect your data. Your privacy and security are our top priorities.",
            },
          ].map((template) => (
            <Button
              key={template.label}
              type="button"
              variant="outline"
              onClick={() => addQuestion(template.question, template.answer)}
              className="h-auto py-3 px-4 rounded-xl border-border hover:border-amber-200 hover:bg-amber-50/30 text-left flex flex-col items-start gap-1 group transition-all"
            >
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-tighter group-hover:tracking-widest transition-all">
                Add {template.label} Template
              </span>
              <span className="text-xs font-bold text-foreground">
                {template.question}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <Label className="text-xs uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
          <Settings2 className="w-3 h-3" />
          Display Options
        </Label>
        <div className="space-y-4 p-4 bg-muted/50 rounded-2xl border border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs font-bold text-foreground">
                Show Categories
              </Label>
              <p className="text-[10px] text-muted-foreground">
                Group FAQ items by their category labels
              </p>
            </div>
            <input
              type="checkbox"
              checked={content.showCategories || false}
              onChange={(e) => onChange({ showCategories: e.target.checked })}
              className="w-5 h-5 rounded-lg border-border text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs font-bold text-foreground">
                Enable Search
              </Label>
              <p className="text-[10px] text-muted-foreground">
                Allow users to search through FAQ content
              </p>
            </div>
            <input
              type="checkbox"
              checked={content.enableSearch || false}
              onChange={(e) => onChange({ enableSearch: e.target.checked })}
              className="w-5 h-5 rounded-lg border-border text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
