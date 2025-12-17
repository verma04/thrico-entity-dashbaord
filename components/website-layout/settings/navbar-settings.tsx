import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ModuleData,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { MenuEditor } from "./menu-editor";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface NavbarSettingsProps {
  content: ModuleData["content"];
  moduleId: string;
  onContentUpdate: (updates: Partial<ModuleData["content"]>) => void;
}

export const NavbarSettings = ({
  moduleId,
  onContentUpdate,
}: NavbarSettingsProps) => {
  const { globalHeader } = useWebsiteBuilderStore();

  const content = globalHeader.id === moduleId ? globalHeader.content : {};

  return (
    <div className="space-y-4">
      {/* Logo Type */}
      <div className="space-y-3">
        <Label>Logo Type</Label>
        <RadioGroup
          value={content.logoType || "text"}
          onValueChange={(val) => onContentUpdate({ logoType: val })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="logo-text" />
            <Label htmlFor="logo-text" className="font-normal">
              Text
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="logo-image" />
            <Label htmlFor="logo-image" className="font-normal">
              Image
            </Label>
          </div>
        </RadioGroup>

        {/* Text Logo */}
        {(content.logoType === "text" || !content.logoType) && (
          <div className="space-y-2">
            <Label htmlFor="logo-text-input">Logo Text</Label>
            <Input
              id="logo-text-input"
              value={content.logoText || ""}
              onChange={(e) => onContentUpdate({ logoText: e.target.value })}
              placeholder="Enter brand name..."
            />
          </div>
        )}

        {/* Image Logo */}
        {content.logoType === "image" && (
          <ImageUploadWithCrop
            label="Logo Image"
            currentImage={content.logoImage}
            onImageUpdate={(imageUrl: string) =>
              onContentUpdate({ logoImage: imageUrl })
            }
            recommendedWidth={150}
            recommendedHeight={50}
            aspectRatio={3}
          />
        )}
      </div>

      {/* Menu Editor */}
      <MenuEditor
        menuItems={content.menuItems}
        onChange={(items) => onContentUpdate({ menuItems: items })}
      />
    </div>
  );
};
