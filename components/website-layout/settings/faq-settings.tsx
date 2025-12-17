import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface FaqSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const FaqSettings: React.FC<FaqSettingsProps> = ({
  content,
  onChange,
}) => {
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
      <Label className="text-xs uppercase font-bold text-muted-foreground">
        FAQ Content
      </Label>

      {/* Section Header */}
      <div className="space-y-3">
        <div>
          <Label className="text-[10px] text-muted-foreground">
            Section Title
          </Label>
          <Input
            value={content.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Frequently Asked Questions"
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Section Description
          </Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Find answers to the most common questions..."
            className="text-xs min-h-[60px]"
            rows={3}
          />
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold">FAQ Questions</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const faqs = [...(content.faqs || [])];
              faqs.push({
                question: "",
                answer: "",
                category: "",
              });
              onChange({ faqs });
            }}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add FAQ
          </Button>
        </div>

        {(content.faqs || []).map((faq: any, index: number) => (
          <div
            key={index}
            className="space-y-2 p-3 bg-background rounded border"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">FAQ {index + 1}</span>
              <button
                onClick={() => {
                  const faqs = [...(content.faqs || [])];
                  faqs.splice(index, 1);
                  onChange({ faqs });
                }}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Question
              </Label>
              <Input
                value={faq.question || ""}
                onChange={(e) => {
                  const faqs = [...(content.faqs || [])];
                  faqs[index] = {
                    ...faqs[index],
                    question: e.target.value,
                  };
                  onChange({ faqs });
                }}
                placeholder="How do I get started?"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Answer
              </Label>
              <Textarea
                value={faq.answer || ""}
                onChange={(e) => {
                  const faqs = [...(content.faqs || [])];
                  faqs[index] = {
                    ...faqs[index],
                    answer: e.target.value,
                  };
                  onChange({ faqs });
                }}
                placeholder="To get started, simply..."
                className="text-xs min-h-[80px]"
                rows={4}
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Category (Optional)
              </Label>
              <Input
                value={faq.category || ""}
                onChange={(e) => {
                  const faqs = [...(content.faqs || [])];
                  faqs[index] = {
                    ...faqs[index],
                    category: e.target.value,
                  };
                  onChange({ faqs });
                }}
                placeholder="General, Billing, Technical"
                className="h-8 text-xs"
              />
            </div>
          </div>
        ))}

        {(content.faqs || []).length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No FAQs yet. Click "Add FAQ" to create one.
          </p>
        )}
      </div>

      {/* Quick FAQ Templates */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs font-bold">Quick Templates</Label>
        <p className="text-[10px] text-muted-foreground">
          Add common FAQ questions with pre-filled content
        </p>

        <div className="grid grid-cols-1 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const faqs = [...(content.faqs || [])];
              faqs.push({
                question: "How do I create an account?",
                answer:
                  "To create an account, click the 'Sign Up' button and follow the registration process. You'll need to provide your email address and create a secure password.",
                category: "Getting Started",
              });
              onChange({ faqs });
            }}
            className="h-8 text-xs"
          >
            + Account Creation
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const faqs = [...(content.faqs || [])];
              faqs.push({
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for applicable plans.",
                category: "Billing",
              });
              onChange({ faqs });
            }}
            className="h-8 text-xs"
          >
            + Payment Methods
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const faqs = [...(content.faqs || [])];
              faqs.push({
                question: "How can I contact support?",
                answer:
                  "You can reach our support team through email, live chat, or by submitting a support ticket. We're here to help 24/7.",
                category: "Support",
              });
              onChange({ faqs });
            }}
            className="h-8 text-xs"
          >
            + Contact Support
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const faqs = [...(content.faqs || [])];
              faqs.push({
                question: "Is my data secure?",
                answer:
                  "Yes, we use industry-standard encryption and security measures to protect your data. Your privacy and security are our top priorities.",
                category: "Security",
              });
              onChange({ faqs });
            }}
            className="h-8 text-xs"
          >
            + Data Security
          </Button>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs font-bold">Display Options</Label>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Show Categories
          </Label>
          <label className="flex items-center space-x-2 mt-1">
            <input
              type="checkbox"
              checked={content.showCategories || false}
              onChange={(e) => onChange({ showCategories: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-xs">Group FAQs by category</span>
          </label>
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Search Functionality
          </Label>
          <label className="flex items-center space-x-2 mt-1">
            <input
              type="checkbox"
              checked={content.enableSearch || false}
              onChange={(e) => onChange({ enableSearch: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-xs">Enable FAQ search</span>
          </label>
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Accordion Style
          </Label>
          <select
            value={content.accordionStyle || "default"}
            onChange={(e) => onChange({ accordionStyle: e.target.value })}
            className="w-full h-8 text-xs border rounded px-2 mt-1"
          >
            <option value="default">Default</option>
            <option value="bordered">Bordered</option>
            <option value="clean">Clean</option>
            <option value="rounded">Rounded</option>
          </select>
        </div>
      </div>
    </div>
  );
};
