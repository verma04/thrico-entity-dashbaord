import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

const CtaBannerSettings = ({
  content,
  onChange,
  layout,
}: {
  content: Record<string, any>;
  onChange: (c: Record<string, any>) => void;
  layout?: string;
}) => {
  return (
    <div className="space-y-4">
      {/* Call-to-Action Buttons */}
      <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
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
              if (buttons.length >= 2) {
                alert("Maximum 2 buttons allowed");
                return;
              }
              buttons.push({
                text: "",
                link: "",
                variant: "primary",
              });
              onChange({ buttons });
            }}
            className="h-7 text-xs"
            disabled={(content.buttons || []).length >= 2}
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
            No buttons yet. Click "Add Button" to create one (max 2). {layout}
          </p>
        )}
      </div>


      {/* Split CTA Image */}
     
        <div className="space-y-2">
          <ImageUploadWithCrop
            label="CTA Image (Split Layout)"
            currentImage={content.image}
            onImageUpdate={(url) => onChange({ image: url })}
            recommendedWidth={800}
            recommendedHeight={600}
            aspectRatio={4 / 3}
            maxFileSize={5}
            showDimensions={true}
          />
        </div>
      

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Secondary Text</Label>
        <Input
          value={content.secondaryText || ""}
          onChange={(e) => onChange({ secondaryText: e.target.value })}
          placeholder="No credit card required"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Background Color
        </Label>

        <Input
          type="color"
          value={content.backgroundColor}
          onChange={(e) => onChange({ backgroundColor: e.target.value })}
        />
      </div>
    </div>
  );
};

export default CtaBannerSettings;
