import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface ContentSectionSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const ContentSectionSettings: React.FC<ContentSectionSettingsProps> = ({
  content,
  onChange,
}) => {
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
      <Label className="text-xs uppercase font-bold text-muted-foreground">
        Custom Content
      </Label>

      {/* Basic Content */}
      <div className="space-y-3">
        <div>
          <Label className="text-[10px] text-muted-foreground">
            Section Heading (Optional)
          </Label>
          <Input
            value={content.heading || ""}
            onChange={(e) => onChange({ heading: e.target.value })}
            placeholder="FEATURED CONTENT"
            className="h-8 text-xs"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Small text above the title (e.g., category or label)
          </p>
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Section Title
          </Label>
          <Input
            value={content.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Custom Content Section"
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Description (Optional)
          </Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Add a description for this section..."
            className="text-xs min-h-[60px]"
            rows={3}
          />
        </div>
      </div>

      {/* Media */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs font-bold">Media</Label>

        <div>
          <ImageUploadWithCrop
            label="Featured Image"
            currentImage={content.image || ""}
            onImageUpdate={(imageUrl: string) =>
              onChange({ image: imageUrl })
            }
            recommendedWidth={1200}
            recommendedHeight={800}
            aspectRatio={3 / 2}
            showDimensions
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Video URL (Optional)
          </Label>
          <Input
            value={content.videoUrl || ""}
            onChange={(e) => onChange({ videoUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs font-bold">Call-to-Action</Label>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Button Text
            </Label>
            <Input
              value={content.buttonText || ""}
              onChange={(e) => onChange({ buttonText: e.target.value })}
              placeholder="Learn More"
              className="h-8 text-xs"
            />
          </div>

          <div>
            <Label className="text-[10px] text-muted-foreground">
              Button Link
            </Label>
            <Input
              value={content.buttonLink || ""}
              onChange={(e) => onChange({ buttonLink: e.target.value })}
              placeholder="/learn-more"
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Button Style
          </Label>
          <select
            value={content.buttonStyle || "primary"}
            onChange={(e) => onChange({ buttonStyle: e.target.value })}
            className="w-full h-8 text-xs border rounded px-2"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold">Additional Content Blocks</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const blocks = [...(content.blocks || [])];
              blocks.push({
                type: "text",
                content: "",
                title: "",
              });
              onChange({ blocks });
            }}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Block
          </Button>
        </div>

        {(content.blocks || []).map((block: any, index: number) => (
          <div
            key={index}
            className="space-y-2 p-3 bg-background rounded border"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">Block {index + 1}</span>
              <button
                onClick={() => {
                  const blocks = [...(content.blocks || [])];
                  blocks.splice(index, 1);
                  onChange({ blocks });
                }}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Block Type
              </Label>
              <select
                value={block.type || "text"}
                onChange={(e) => {
                  const blocks = [...(content.blocks || [])];
                  blocks[index] = {
                    ...blocks[index],
                    type: e.target.value,
                  };
                  onChange({ blocks });
                }}
                className="w-full h-8 text-xs border rounded px-2"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="quote">Quote</option>
                <option value="code">Code</option>
              </select>
            </div>

            {block.type !== "image" && block.type !== "video" && (
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Block Title (Optional)
                </Label>
                <Input
                  value={block.title || ""}
                  onChange={(e) => {
                    const blocks = [...(content.blocks || [])];
                    blocks[index] = {
                      ...blocks[index],
                      title: e.target.value,
                    };
                    onChange({ blocks });
                  }}
                  placeholder="Block title"
                  className="h-8 text-xs"
                />
              </div>
            )}

            <div>
              <Label className="text-[10px] text-muted-foreground">
                {block.type === "image" && "Block Image"}
                {block.type === "video" && "Video URL"}
                {block.type === "quote" && "Quote Text"}
                {block.type === "code" && "Code Content"}
                {block.type === "text" && "Text Content"}
              </Label>
              {block.type === "text" ||
              block.type === "quote" ||
              block.type === "code" ? (
                <Textarea
                  value={block.content || ""}
                  onChange={(e) => {
                    const blocks = [...(content.blocks || [])];
                    blocks[index] = {
                      ...blocks[index],
                      content: e.target.value,
                    };
                    onChange({ blocks });
                  }}
                  placeholder={
                    block.type === "quote"
                      ? "Enter quote text..."
                      : block.type === "code"
                      ? "Enter code..."
                      : "Enter text content..."
                  }
                  className="text-xs min-h-[60px]"
                  rows={3}
                />
              ) : block.type === "image" ? (
                <ImageUploadWithCrop
                  label=""
                  currentImage={block.content || ""}
                  onImageUpdate={(imageUrl: string) => {
                    const blocks = [...(content.blocks || [])];
                    blocks[index] = {
                      ...blocks[index],
                      content: imageUrl,
                    };
                    onChange({ blocks });
                  }}
                  recommendedWidth={800}
                  recommendedHeight={600}
                  aspectRatio={4 / 3}
                  showDimensions
                />
              ) : (
                <Input
                  value={block.content || ""}
                  onChange={(e) => {
                    const blocks = [...(content.blocks || [])];
                    blocks[index] = {
                      ...blocks[index],
                      content: e.target.value,
                    };
                    onChange({ blocks });
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                  className="h-8 text-xs"
                />
              )}
            </div>

            {block.type === "quote" && (
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Quote Author (Optional)
                </Label>
                <Input
                  value={block.author || ""}
                  onChange={(e) => {
                    const blocks = [...(content.blocks || [])];
                    blocks[index] = {
                      ...blocks[index],
                      author: e.target.value,
                    };
                    onChange({ blocks });
                  }}
                  placeholder="Author name"
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>
        ))}

        {(content.blocks || []).length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No content blocks yet. Click "Add Block" to create one.
          </p>
        )}
      </div>

      {/* Layout Options */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs font-bold">Layout Options</Label>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Content Alignment
          </Label>
          <select
            value={content.alignment || "left"}
            onChange={(e) => onChange({ alignment: e.target.value })}
            className="w-full h-8 text-xs border rounded px-2"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Background Color
          </Label>
          <div className="flex gap-2">
            <Input
              value={content.backgroundColor || ""}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="h-8 text-xs flex-1"
            />
            <input
              type="color"
              value={content.backgroundColor || "#ffffff"}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              className="w-8 h-8 border rounded cursor-pointer"
            />
          </div>
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Text Color
          </Label>
          <div className="flex gap-2">
            <Input
              value={content.textColor || ""}
              onChange={(e) => onChange({ textColor: e.target.value })}
              placeholder="#000000"
              className="h-8 text-xs flex-1"
            />
            <input
              type="color"
              value={content.textColor || "#000000"}
              onChange={(e) => onChange({ textColor: e.target.value })}
              className="w-8 h-8 border rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
