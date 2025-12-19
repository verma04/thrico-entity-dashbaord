import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { LayoutType } from "@/store/useWebsiteBuilderStore";

interface HeroSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout: LayoutType;
}

export const HeroSettings: React.FC<HeroSettingsProps> = ({
  content,
  onChange,
  layout,
}) => {
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
      <Label className="text-xs uppercase font-bold text-muted-foreground">
        Hero Content
      </Label>

      {/* Main Heading */}
      <div className="space-y-2">
        <Label
          htmlFor="hero-title"
          className="text-[10px] text-muted-foreground"
        >
          Main Heading
        </Label>
        <Input
          id="hero-title"
          value={content.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Welcome to Our Community"
          className="h-8 text-xs"
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <Label
          htmlFor="description "
          className="text-[10px] text-muted-foreground"
        >
          Subtitle
        </Label>
        <Textarea
          id="description "
          value={content.description || ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Discover amazing opportunities and connect with like-minded people"
          className="text-xs min-h-[60px]"
          rows={3}
        />
      </div>

      {/* Background Image */}
      <ImageUploadWithCrop
        label="Background Image"
        currentImage={content.image}
        onImageUpdate={(imageUrl: string) => onChange({ image: imageUrl })}
        recommendedWidth={1920}
        recommendedHeight={1080}
        aspectRatio={16 / 9}
        maxFileSize={8}
      />

      {/* Call-to-Action Buttons */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Call-to-Action Buttons
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const buttons = [...(content.buttons || [])];
              buttons.push({
                text: "",
                link: "",
                variant: "primary",
              });
              onChange({ buttons });
            }}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Button
          </Button>
        </div>

        {(content.buttons || []).map((button: any, index: number) => (
          <div
            key={index}
            className="space-y-2 p-3 bg-background rounded border"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">Button {index + 1}</span>
              <button
                onClick={() => {
                  const buttons = [...(content.buttons || [])];
                  buttons.splice(index, 1);
                  onChange({ buttons });
                }}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Button Text
                </Label>
                <Input
                  value={button.text || ""}
                  onChange={(e) => {
                    const buttons = [...(content.buttons || [])];
                    buttons[index] = {
                      ...buttons[index],
                      text: e.target.value,
                    };
                    onChange({ buttons });
                  }}
                  placeholder="Get Started"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Link/Action
                </Label>
                <Input
                  value={button.link || ""}
                  onChange={(e) => {
                    const buttons = [...(content.buttons || [])];
                    buttons[index] = {
                      ...buttons[index],
                      link: e.target.value,
                    };
                    onChange({ buttons });
                  }}
                  placeholder="/signup or #section"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Button Style
              </Label>
              <select
                value={button.variant || "primary"}
                onChange={(e) => {
                  const buttons = [...(content.buttons || [])];
                  buttons[index] = {
                    ...buttons[index],
                    variant: e.target.value,
                  };
                  onChange({ buttons });
                }}
                className="w-full h-8 text-xs border rounded px-2"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
          </div>
        ))}

        {(content.buttons || []).length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No buttons yet. Click "Add Button" to create one.
          </p>
        )}
      </div>

      {/* Layout-specific fields */}

      {/* CAROUSEL LAYOUT */}
      {layout === "carousel" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">Carousel Settings</Label>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Auto-play Duration (seconds)
            </Label>
            <Input
              value={content.autoPlayDuration || "5"}
              onChange={(e) => onChange({ autoPlayDuration: e.target.value })}
              placeholder="5"
              className="h-8 text-xs"
              type="number"
              min="1"
              max="10"
            />
          </div>
          <p className="text-[9px] text-muted-foreground">
            Carousel slides are managed in the carousel component settings.
          </p>
        </div>
      )}

      {/* VIDEO LAYOUT */}
      {layout === "video" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">Video Settings</Label>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Video URL
            </Label>
            <Input
              value={content.videoUrl || ""}
              onChange={(e) => onChange({ videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              className="h-8 text-xs"
            />
          </div>
          <p className="text-[9px] text-muted-foreground">
            Supports YouTube and Vimeo URLs
          </p>
        </div>
      )}

      {/* SAAS-MODERN LAYOUT */}
      {layout === "saas-modern" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">SaaS Modern Settings</Label>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Badge Text
            </Label>
            <Input
              value={content.badge || ""}
              onChange={(e) => onChange({ badge: e.target.value })}
              placeholder="New Feature"
              className="h-8 text-xs"
            />
          </div>
          <p className="text-[9px] text-muted-foreground">
            Modern SaaS-style hero with clean design
          </p>
        </div>
      )}

      {/* BENTO-GRID LAYOUT */}
      {layout === "bento-grid" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">Bento Grid Settings</Label>
          <p className="text-[9px] text-muted-foreground">
            Bento grid layout with multiple content blocks
          </p>
        </div>
      )}

      {/* SPLIT LAYOUT */}
      {layout === "split" && (
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold">Features / Stats</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const features = [...(content.features || [])];
                features.push({ title: "", description: "" });
                onChange({ features });
              }}
              className="h-7 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Feature
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {(content.features || []).map((feature: any, index: number) => (
              <div key={index} className="border rounded p-2 bg-muted/5">
                <div className="flex justify-between items-start mb-2">
                  <Label className="text-[9px] text-muted-foreground">
                    Feature {index + 1}
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const features = [...(content.features || [])];
                      features.splice(index, 1);
                      onChange({ features });
                    }}
                    className="h-5 w-5 p-0 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-[9px] text-muted-foreground">
                      Title / Value
                    </Label>
                    <Input
                      value={feature.title || ""}
                      onChange={(e) => {
                        const features = [...(content.features || [])];
                        features[index] = {
                          ...features[index],
                          title: e.target.value,
                        };
                        onChange({ features });
                      }}
                      placeholder="10K+ Members"
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[9px] text-muted-foreground">
                      Description (optional)
                    </Label>
                    <Input
                      value={feature.description || ""}
                      onChange={(e) => {
                        const features = [...(content.features || [])];
                        features[index] = {
                          ...features[index],
                          description: e.target.value,
                        };
                        onChange({ features });
                      }}
                      placeholder="Active community members"
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}

            {(content.features || []).length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                No features yet. Click "Add Feature" to create one.
              </p>
            )}
          </div>
        </div>
      )}

      {/* NEWSLETTER-FOCUS LAYOUT */}
      {layout === "newsletter-focus" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">Newsletter Settings</Label>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Placeholder Text
            </Label>
            <Input
              value={content.placeholder || ""}
              onChange={(e) => onChange({ placeholder: e.target.value })}
              placeholder="Enter your email..."
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Button Text
            </Label>
            <Input
              value={content.buttonText || ""}
              onChange={(e) => onChange({ buttonText: e.target.value })}
              placeholder="Subscribe"
              className="h-8 text-xs"
            />
          </div>
        </div>
      )}

      {/* APP-SHOWCASE LAYOUT */}
      {layout === "app-showcase" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">App Showcase Settings</Label>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              App Screenshot URL
            </Label>
            <Input
              value={content.appScreenshot || ""}
              onChange={(e) => onChange({ appScreenshot: e.target.value })}
              placeholder="https://..."
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Badge Text
            </Label>
            <Input
              value={content.badge || ""}
              onChange={(e) => onChange({ badge: e.target.value })}
              placeholder="Download Now"
              className="h-8 text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};
