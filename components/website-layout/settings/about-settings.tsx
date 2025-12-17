import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface Milestone {
  year?: string;
  event?: string;
}

interface Value {
  icon?: string;
  title?: string;
  description?: string;
}

interface AboutSettingsProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    story?: string;
    vision?: string;
    mission?: string;
    intro?: string;
    ctaText?: string;
    founderName?: string;
    founderTitle?: string;
    message?: string;
    founderImage?: string;
    image?: string;
    milestones?: Milestone[];
    values?: Value[];
    [key: string]: any;
  };
  onChange: (updates: any) => void;
  layout?: string;
}

const AboutSettings: React.FC<AboutSettingsProps> = ({
  content,
  onChange,
  layout,
}) => {
  const updateContent = (updates: any) => {
    onChange(updates);
  };

  const addMilestone = () => {
    const milestones = [...(content.milestones || [])];
    milestones.push({ year: "2024", event: "New Milestone" });
    updateContent({ milestones });
  };

  const removeMilestone = (index: number) => {
    const milestones = [...(content.milestones || [])];
    milestones.splice(index, 1);
    updateContent({ milestones });
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const milestones = [...(content.milestones || [])];
    milestones[index] = {
      ...milestones[index],
      [field]: value,
    };
    updateContent({ milestones });
  };

  const addValue = () => {
    const values = [...(content.values || [])];
    values.push({
      icon: "Heart",
      title: "New Value",
      description: "Description here",
    });
    updateContent({ values });
  };

  const removeValue = (index: number) => {
    const values = [...(content.values || [])];
    values.splice(index, 1);
    updateContent({ values });
  };

  const updateValue = (index: number, field: string, value: string) => {
    const values = [...(content.values || [])];
    values[index] = {
      ...values[index],
      [field]: value,
    };
    updateContent({ values });
  };

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
      <Label className="text-xs uppercase font-bold text-muted-foreground">
        About Page Content
      </Label>
      <p className="text-[10px] text-muted-foreground">
        Customize content based on selected layout
      </p>

      {/* Common Fields */}
      <div className="space-y-2">
        <div>
          <Label className="text-[10px] text-muted-foreground">Title</Label>
          <Input
            value={content.title || ""}
            onChange={(e) => updateContent({ title: e.target.value })}
            placeholder="Our Story / About Us"
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">
            Subtitle / Description
          </Label>
          <Textarea
            value={content.subtitle || content.description || ""}
            onChange={(e) =>
              updateContent({
                subtitle: e.target.value,
                description: e.target.value,
              })
            }
            placeholder="Brief description..."
            className="text-xs min-h-[50px]"
            rows={2}
          />
        </div>
      </div>

      {/* Layout-Specific Fields */}
      {layout === "story-vision" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">Story & Vision Fields</Label>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Story Text
            </Label>
            <Textarea
              value={content.story || ""}
              onChange={(e) => updateContent({ story: e.target.value })}
              placeholder="Our journey began..."
              className="text-xs min-h-[60px]"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Vision Statement
            </Label>
            <Textarea
              value={content.vision || ""}
              onChange={(e) => updateContent({ vision: e.target.value })}
              placeholder="To create a world where..."
              className="text-xs min-h-[50px]"
              rows={2}
            />
          </div>

          {/* Milestones Editor */}
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-xs font-bold">Journey Milestones</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMilestone}
                className="h-6 text-[10px]"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Milestone
              </Button>
            </div>

            <div className="space-y-2">
              {(content.milestones || []).map(
                (milestone: Milestone, index: number) => (
                  <div key={index} className="border rounded p-2 bg-muted/5">
                    <div className="flex justify-between items-start mb-2">
                      <Label className="text-[9px] text-muted-foreground">
                        Milestone {index + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                        className="h-5 w-5 p-0 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-[9px] text-muted-foreground">
                          Year
                        </Label>
                        <Input
                          value={milestone.year || ""}
                          onChange={(e) =>
                            updateMilestone(index, "year", e.target.value)
                          }
                          placeholder="2024"
                          className="h-7 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-[9px] text-muted-foreground">
                          Event
                        </Label>
                        <Input
                          value={milestone.event || ""}
                          onChange={(e) =>
                            updateMilestone(index, "event", e.target.value)
                          }
                          placeholder="Founded"
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )
              )}

              {(content.milestones || []).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No milestones yet. Click "Add Milestone" to create one.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {layout === "mission-values" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">Mission & Values</Label>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Mission Statement
            </Label>
            <Textarea
              value={content.mission || ""}
              onChange={(e) => updateContent({ mission: e.target.value })}
              placeholder="Empowering communities to..."
              className="text-xs min-h-[50px]"
              rows={2}
            />
          </div>

          {/* Core Values Editor */}
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-xs font-bold">Core Values</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addValue}
                className="h-6 text-[10px]"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Value
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {(content.values || []).map((value: Value, index: number) => (
                <div key={index} className="border rounded p-2 bg-muted/5">
                  <div className="flex justify-between items-start mb-2">
                    <Label className="text-[9px] text-muted-foreground">
                      Value {index + 1}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeValue(index)}
                      className="h-5 w-5 p-0 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[9px] text-muted-foreground">
                          Icon
                        </Label>
                        <Input
                          value={value.icon || ""}
                          onChange={(e) =>
                            updateValue(index, "icon", e.target.value)
                          }
                          placeholder="Heart"
                          className="h-7 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[9px] text-muted-foreground">
                          Title
                        </Label>
                        <Input
                          value={value.title || ""}
                          onChange={(e) =>
                            updateValue(index, "title", e.target.value)
                          }
                          placeholder="Community First"
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[9px] text-muted-foreground">
                        Description
                      </Label>
                      <Textarea
                        value={value.description || ""}
                        onChange={(e) =>
                          updateValue(index, "description", e.target.value)
                        }
                        placeholder="We put our members at the center..."
                        className="text-xs min-h-[40px]"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(content.values || []).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No values yet. Click "Add Value" to create one.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {layout === "founder-message" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">Founder Details</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">
                Founder Name
              </Label>
              <Input
                value={content.founderName || ""}
                onChange={(e) => updateContent({ founderName: e.target.value })}
                placeholder="John Doe"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">Title</Label>
              <Input
                value={content.founderTitle || ""}
                onChange={(e) =>
                  updateContent({ founderTitle: e.target.value })
                }
                placeholder="Founder & CEO"
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Message</Label>
            <Textarea
              value={content.message || ""}
              onChange={(e) => updateContent({ message: e.target.value })}
              placeholder="When we started this journey..."
              className="text-xs min-h-[80px]"
              rows={4}
            />
          </div>
          <ImageUploadWithCrop
            label="Founder Image"
            currentImage={content.founderImage}
            onImageUpdate={(imageUrl: string) =>
              updateContent({ founderImage: imageUrl })
            }
            recommendedWidth={400}
            recommendedHeight={400}
            aspectRatio={1}
            maxFileSize={3}
          />
        </div>
      )}

      {layout === "simple-overview" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">Overview Content</Label>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Introduction
            </Label>
            <Textarea
              value={content.intro || ""}
              onChange={(e) => updateContent({ intro: e.target.value })}
              placeholder="Founded in 2020, we've been dedicated to..."
              className="text-xs min-h-[60px]"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              CTA Text
            </Label>
            <Input
              value={content.ctaText || ""}
              onChange={(e) => updateContent({ ctaText: e.target.value })}
              placeholder="Start building your community today"
              className="h-8 text-xs"
            />
          </div>
        </div>
      )}

      {layout === "impact-growth" && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold">Impact & Growth Content</Label>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Subtitle
            </Label>
            <Input
              value={content.subtitle || ""}
              onChange={(e) => updateContent({ subtitle: e.target.value })}
              placeholder="Measuring success through community growth"
              className="h-8 text-xs"
            />
          </div>
          <div className="pt-2">
            <Label className="text-[10px] text-muted-foreground mb-2 block">
              Key Stats (4 stats displayed)
            </Label>
            <p className="text-[9px] text-muted-foreground mb-2">
              Default stats will be shown if not customized
            </p>
          </div>
          <div className="pt-2">
            <Label className="text-[10px] text-muted-foreground mb-2 block">
              Achievements (4 achievements displayed)
            </Label>
            <p className="text-[9px] text-muted-foreground">
              Default achievements will be shown if not customized
            </p>
          </div>
        </div>
      )}

      {/* Common Image Upload */}
      <div className="pt-2 border-t">
        <ImageUploadWithCrop
          label="Main Image (optional)"
          currentImage={content.image}
          onImageUpdate={(imageUrl: string) =>
            updateContent({ image: imageUrl })
          }
          recommendedWidth={1200}
          recommendedHeight={600}
          aspectRatio={2}
          maxFileSize={5}
        />
      </div>
    </div>
  );
};

export default AboutSettings;
