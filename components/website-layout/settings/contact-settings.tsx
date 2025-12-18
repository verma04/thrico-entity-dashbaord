import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface ContactSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout: string;
}

export const ContactSettings: React.FC<ContactSettingsProps> = ({
  content,
  onChange,
  layout,
}) => {
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
      <Label className="text-xs uppercase font-bold text-muted-foreground">
        Contact Information
      </Label>

      {/* Basic Contact Info */}
      <div className="space-y-3">
        <div>
          <Label className="text-[10px] text-muted-foreground">
            Contact Title
          </Label>
          <Input
            value={content.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Get in Touch"
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Subtitle
          </Label>
          <Input
            value={content.subtitle || ""}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            placeholder="We'd love to hear from you"
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Description
          </Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Additional information about contacting us..."
            className="text-xs min-h-[60px]"
            rows={3}
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Email Address
          </Label>
          <Input
            value={content.email || ""}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="contact@example.com"
            className="h-8 text-xs"
            type="email"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Phone Number
          </Label>
          <Input
            value={content.phone || ""}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="h-8 text-xs"
            type="tel"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">Address</Label>
          <Textarea
            value={content.address || ""}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="123 Main St, City, State 12345"
            className="text-xs min-h-[50px]"
            rows={2}
          />
        </div>

        <div>
          <ImageUploadWithCrop
            label="Contact Image (Optional)"
            currentImage={content.image || ""}
            onImageUpdate={(imageUrl: string) =>
              onChange({ image: imageUrl })
            }
            recommendedWidth={600}
            recommendedHeight={400}
            aspectRatio={3 / 2}
            showDimensions
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Add a photo of your team, office, or contact person
          </p>
        </div>
      </div>

      {/* Support Info */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs font-bold">Support Information</Label>
        <div>
          <Label className="text-[10px] text-muted-foreground">
            Response Time
          </Label>
          <Input
            value={content.responseTime || ""}
            onChange={(e) => onChange({ responseTime: e.target.value })}
            placeholder="We typically respond within 24 hours"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">
            Business Hours
          </Label>
          <Input
            value={content.hours || ""}
            onChange={(e) => onChange({ hours: e.target.value })}
            placeholder="Mon-Fri: 9AM-5PM"
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold">Social Media Links</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const socialLinks = [...(content.socialLinks || [])];
              socialLinks.push({
                platform: "",
                url: "",
                icon: "",
              });
              onChange({ socialLinks });
            }}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Social
          </Button>
        </div>

        {(content.socialLinks || []).map((social: any, index: number) => (
          <div
            key={index}
            className="space-y-2 p-3 bg-background rounded border"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">Social {index + 1}</span>
              <button
                onClick={() => {
                  const socialLinks = [...(content.socialLinks || [])];
                  socialLinks.splice(index, 1);
                  onChange({ socialLinks });
                }}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Platform
                </Label>
                <select
                  value={social.platform || ""}
                  onChange={(e) => {
                    const socialLinks = [...(content.socialLinks || [])];
                    socialLinks[index] = {
                      ...socialLinks[index],
                      platform: e.target.value,
                    };
                    onChange({ socialLinks });
                  }}
                  className="w-full h-8 text-xs border rounded px-2"
                >
                  <option value="">Select Platform</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="github">GitHub</option>
                </select>
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">URL</Label>
                <Input
                  value={social.url || ""}
                  onChange={(e) => {
                    const socialLinks = [...(content.socialLinks || [])];
                    socialLinks[index] = {
                      ...socialLinks[index],
                      url: e.target.value,
                    };
                    onChange({ socialLinks });
                  }}
                  placeholder="https://..."
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        ))}

        {(content.socialLinks || []).length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No social links yet. Click "Add Social" to create one.
          </p>
        )}
      </div>

      {/* FAQs */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold">Frequently Asked Questions</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const faqs = [...(content.faqs || [])];
              faqs.push({
                question: "",
                answer: "",
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
                placeholder="How do I reset my password?"
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
                placeholder="Go to settings and click reset password..."
                className="text-xs min-h-[50px]"
                rows={2}
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

      {/* Map Settings */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs font-bold">Map Settings</Label>
        <div>
          <Label className="text-[10px] text-muted-foreground">
            Map Embed URL
          </Label>
          <Input
            value={content.mapUrl || ""}
            onChange={(e) => onChange({ mapUrl: e.target.value })}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="h-8 text-xs"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Get embed URL from Google Maps → Share → Embed a map
          </p>
        </div>
      </div>

    
    </div>
  );
};
