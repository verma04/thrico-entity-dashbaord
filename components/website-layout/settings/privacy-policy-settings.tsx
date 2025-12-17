import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface PrivacyPolicySettingsProps {
  content: Record<string, any>;
  onChange: (updates: Record<string, any>) => void;
}

export const PrivacyPolicySettings: React.FC<PrivacyPolicySettingsProps> = ({
  content,
  onChange,
}) => {
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
      <Label className="text-xs uppercase font-bold text-muted-foreground">
        Privacy Policy Content
      </Label>

      {/* Basic Information */}
      <div className="space-y-3">
        <div>
          <Label className="text-[10px] text-muted-foreground">
            Page Title
          </Label>
          <Input
            value={content.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Privacy Policy"
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Last Updated Date
          </Label>
          <Input
            value={content.lastUpdated || ""}
            onChange={(e) => onChange({ lastUpdated: e.target.value })}
            placeholder="December 11, 2025"
            className="h-8 text-xs"
            type="date"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Introduction
          </Label>
          <Textarea
            value={content.introduction || ""}
            onChange={(e) => onChange({ introduction: e.target.value })}
            placeholder="This Privacy Policy describes how we collect, use, and protect your information..."
            className="text-xs min-h-[80px]"
            rows={4}
          />
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold">Policy Sections</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const sections = [...(content.sections || [])];
              sections.push({
                title: "",
                content: "",
              });
              onChange({ sections });
            }}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Section
          </Button>
        </div>

        {(content.sections || []).map(
          (section: Record<string, any>, index: number) => (
            <div
              key={index}
              className="space-y-2 p-3 bg-background rounded border"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold">Section {index + 1}</span>
                <button
                  onClick={() => {
                    const sections = [...(content.sections || [])];
                    sections.splice(index, 1);
                    onChange({ sections });
                  }}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Section Title
                </Label>
                <Input
                  value={section.title || ""}
                  onChange={(e) => {
                    const sections = [...(content.sections || [])];
                    sections[index] = {
                      ...sections[index],
                      title: e.target.value,
                    };
                    onChange({ sections });
                  }}
                  placeholder="Information We Collect"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Section Content
                </Label>
                <Textarea
                  value={section.content || ""}
                  onChange={(e) => {
                    const sections = [...(content.sections || [])];
                    sections[index] = {
                      ...sections[index],
                      content: e.target.value,
                    };
                    onChange({ sections });
                  }}
                  placeholder="Detailed explanation of this section..."
                  className="text-xs min-h-[80px]"
                  rows={4}
                />
              </div>
            </div>
          )
        )}

        {(content.sections || []).length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No sections yet. Click "Add Section" to create one.
          </p>
        )}
      </div>

      {/* Contact Information */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs font-bold">Contact Information</Label>
        <div>
          <Label className="text-[10px] text-muted-foreground">
            Contact Email for Privacy Questions
          </Label>
          <Input
            value={content.contactEmail || ""}
            onChange={(e) => onChange({ contactEmail: e.target.value })}
            placeholder="privacy@example.com"
            className="h-8 text-xs"
            type="email"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Contact Address (Optional)
          </Label>
          <Textarea
            value={content.contactAddress || ""}
            onChange={(e) => onChange({ contactAddress: e.target.value })}
            placeholder="123 Main St, City, State 12345"
            className="text-xs min-h-[50px]"
            rows={2}
          />
        </div>
      </div>

      {/* Quick Sections Templates */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs font-bold">Quick Templates</Label>
        <p className="text-[10px] text-muted-foreground">
          Add common privacy policy sections with pre-filled content
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const sections = [...(content.sections || [])];
              sections.push({
                title: "Information We Collect",
                content:
                  "We collect information you provide directly to us, information we collect automatically when you use our services, and information from third parties.",
              });
              onChange({ sections });
            }}
            className="h-8 text-xs"
          >
            + Data Collection
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const sections = [...(content.sections || [])];
              sections.push({
                title: "How We Use Information",
                content:
                  "We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.",
              });
              onChange({ sections });
            }}
            className="h-8 text-xs"
          >
            + Data Usage
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const sections = [...(content.sections || [])];
              sections.push({
                title: "Information Sharing",
                content:
                  "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.",
              });
              onChange({ sections });
            }}
            className="h-8 text-xs"
          >
            + Data Sharing
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const sections = [...(content.sections || [])];
              sections.push({
                title: "Your Rights",
                content:
                  "You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.",
              });
              onChange({ sections });
            }}
            className="h-8 text-xs"
          >
            + User Rights
          </Button>
        </div>
      </div>
    </div>
  );
};
