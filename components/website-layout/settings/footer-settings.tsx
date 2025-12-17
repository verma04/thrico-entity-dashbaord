import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ModuleData,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { MenuEditor } from "./menu-editor";
import { SocialLinksEditor } from "./social-links-editor";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface FooterSettingsProps {
  content: ModuleData["content"];
  moduleId: string;
  onContentUpdate: (updates: Partial<ModuleData["content"]>) => void;
}

export const FooterSettings = ({
  moduleId,
  onContentUpdate,
}: FooterSettingsProps) => {
  const { globalFooter } = useWebsiteBuilderStore();

  const content = globalFooter.id === moduleId ? globalFooter.content : {};
  return (
    <div className="space-y-6">
      {/* Logo Type */}
      <div className="space-y-3">
        <Label>Logo Type</Label>
        <RadioGroup
          value={content.logoType || "text"}
          onValueChange={(val) => onContentUpdate({ logoType: val })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="logo-text-footer" />
            <Label htmlFor="logo-text-footer" className="font-normal">
              Text
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="logo-image-footer" />
            <Label htmlFor="logo-image-footer" className="font-normal">
              Image
            </Label>
          </div>
        </RadioGroup>

        {/* Text Logo */}
        {(content.logoType === "text" || !content.logoType) && (
          <div className="space-y-2">
            <Label htmlFor="logo-text-input-footer">Logo Text</Label>
            <Input
              id="logo-text-input-footer"
              value={content.logoText || ""}
              onChange={(e) => onContentUpdate({ logoText: e.target.value })}
              placeholder="Enter brand name..."
            />
          </div>
        )}

        {/* Image Logo */}
        {content.logoType === "image" && (
          <ImageUploadWithCrop
            label="Footer Logo"
            currentImage={content.logoImage}
            onImageUpdate={(imageUrl: string) =>
              onContentUpdate({ logoImage: imageUrl })
            }
            recommendedWidth={150}
            recommendedHeight={50}
            aspectRatio={3}
            maxFileSize={2}
          />
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="footer-description">Description</Label>
        <Textarea
          id="footer-description"
          value={content.description || ""}
          onChange={(e) => onContentUpdate({ description: e.target.value })}
          placeholder="Footer description or tagline..."
          rows={3}
        />
      </div>

      {/* Copyright Text */}
      <div className="space-y-2">
        <Label htmlFor="footer-copyright">Copyright Text</Label>
        <Input
          id="footer-copyright"
          value={content.copyrightText || ""}
          onChange={(e) => onContentUpdate({ copyrightText: e.target.value })}
          placeholder={`© ${new Date().getFullYear()} All rights reserved.`}
        />
      </div>

      {/* Menu Editor */}
      <div className="space-y-2">
        <Label>Footer Navigation</Label>
        <MenuEditor
          menuItems={content.menuItems}
          onChange={(items) => onContentUpdate({ menuItems: items })}
        />
      </div>

      {/* Social Links Editor */}
      <div className="space-y-2">
        <Label>Social Media Links</Label>
        <SocialLinksEditor
          links={content.socialLinks}
          onChange={(links) => onContentUpdate({ socialLinks: links })}
        />
      </div>
    </div>
  );
};
