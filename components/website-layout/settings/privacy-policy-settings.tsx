import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Shield,
  FileText,
  Mail,
  MapPin,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacyPolicySettingsProps {
  content: Record<string, any>;
  onChange: (updates: Record<string, any>) => void;
}

export const PrivacyPolicySettings: React.FC<PrivacyPolicySettingsProps> = ({
  content,
  onChange,
}) => {
  const sections = content.sections || [];

  const addTemplateSection = (title: string, body: string) => {
    const newSections = [...sections, { title, content: body }];
    onChange({ sections: newSections });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Basic Information */}
      <div className="space-y-4">
        <Label className="text-xs uppercase font-black text-blue-600 tracking-widest flex items-center gap-2">
          <Shield className="w-3 h-3" />
          Document Basics
        </Label>
        <div className="space-y-4 p-4 bg-muted/50 rounded-2xl border border-border">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Page Title
            </Label>
            <Input
              value={content.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Privacy Policy"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Last Updated Date
            </Label>
            <Input
              value={content.lastUpdated || ""}
              onChange={(e) => onChange({ lastUpdated: e.target.value })}
              placeholder="December 11, 2025"
              className="h-10 rounded-xl"
              type="date"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Introduction / Preamble
            </Label>
            <Textarea
              value={content.introduction || ""}
              onChange={(e) => onChange({ introduction: e.target.value })}
              placeholder="This Privacy Policy describes how we collect, use, and protect your information..."
              className="min-h-[100px] rounded-xl text-sm"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-black text-blue-600 tracking-widest flex items-center gap-2">
            <FileText className="w-3 h-3" />
            Policy Sections
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const newSections = [...sections, { title: "", content: "" }];
              onChange({ sections: newSections });
            }}
            className="h-8 rounded-full text-[10px] font-bold uppercase"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Section
          </Button>
        </div>

        <div className="space-y-4">
          {sections.map((section: any, index: number) => (
            <div
              key={index}
              className="group p-5 bg-card border rounded-2xl shadow-sm space-y-4 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">
                    Section {index + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newSections = sections.filter(
                      (_: any, i: number) => i !== index
                    );
                    onChange({ sections: newSections });
                  }}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                    Section Title
                  </Label>
                  <Input
                    value={section.title || ""}
                    onChange={(e) => {
                      const newSections = [...sections];
                      newSections[index] = {
                        ...newSections[index],
                        title: e.target.value,
                      };
                      onChange({ sections: newSections });
                    }}
                    placeholder="e.g. 1. Information We Collect"
                    className="h-9 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                    Content
                  </Label>
                  <Textarea
                    value={section.content || ""}
                    onChange={(e) => {
                      const newSections = [...sections];
                      newSections[index] = {
                        ...newSections[index],
                        content: e.target.value,
                      };
                      onChange({ sections: newSections });
                    }}
                    placeholder="Detailed explanation..."
                    className="min-h-[120px] rounded-xl text-sm"
                    rows={5}
                  />
                </div>
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="text-center py-12 bg-muted/50 rounded-4xl border border-dashed border-border">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-xs text-muted-foreground font-medium font-sans">
                No policy sections yet. Add one manually or use a template.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 border-t pt-6">
        <Label className="text-xs uppercase font-black text-blue-600 tracking-widest flex items-center gap-2">
          <Mail className="w-3 h-3" />
          Contact Details
        </Label>
        <div className="space-y-4 p-4 bg-muted/50 rounded-2xl border border-border">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Privacy Email
            </Label>
            <Input
              value={content.contactEmail || ""}
              onChange={(e) => onChange({ contactEmail: e.target.value })}
              placeholder="privacy@example.com"
              className="h-10 rounded-xl"
              type="email"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Physical Address (Optional)
            </Label>
            <Textarea
              value={content.contactAddress || ""}
              onChange={(e) => onChange({ contactAddress: e.target.value })}
              placeholder="123 Legal Way, Suite 100..."
              className="min-h-[60px] rounded-xl text-sm"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="space-y-4 border-t pt-6">
        <Label className="text-xs uppercase font-black text-blue-600 tracking-widest flex items-center gap-2">
          <Plus className="w-3 h-3" />
          Quick Sections Templates
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              title: "Information We Collect",
              content:
                "We collect information you provide directly to us, information we collect automatically when you use our services, and information from third parties.",
              label: "Data Collection",
            },
            {
              title: "How We Use Information",
              content:
                "We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.",
              label: "Data Usage",
            },
            {
              title: "Information Sharing",
              content:
                "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.",
              label: "Data Sharing",
            },
            {
              title: "Your Rights",
              content:
                "You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.",
              label: "User Rights",
            },
          ].map((template) => (
            <Button
              key={template.label}
              type="button"
              variant="outline"
              onClick={() =>
                addTemplateSection(template.title, template.content)
              }
              className="h-auto py-3 px-4 rounded-xl border-border hover:border-blue-200 hover:bg-blue-50/30 flex flex-col items-start gap-1 text-left"
            >
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider font-sans">
                {template.label}
              </span>
              <span className="text-[9px] text-muted-foreground line-clamp-1 font-normal font-sans">
                {template.title}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
