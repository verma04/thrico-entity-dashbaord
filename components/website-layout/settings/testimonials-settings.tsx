import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface Testimonial {
  name?: string;
  role?: string;
  company?: string;
  testimonial?: string;
  image?: string;
  rating?: number;
}

interface TestimonialsSettingsProps {
  content: {
    testimonials?: Testimonial[];
    [key: string]: any;
  };
  onChange: (updates: any) => void;
}

const TestimonialsSettings: React.FC<TestimonialsSettingsProps> = ({
  content,
  onChange,
}) => {
  const updateTestimonials = (testimonials: Testimonial[]) => {
    onChange({ testimonials });
  };

  const addTestimonial = () => {
    const testimonials = [...(content.testimonials || [])];
    testimonials.push({
      name: "",
      role: "",
      company: "",
      testimonial: "",
      image: "",
      rating: 5,
    });
    updateTestimonials(testimonials);
  };

  const removeTestimonial = (index: number) => {
    const testimonials = [...(content.testimonials || [])];
    testimonials.splice(index, 1);
    updateTestimonials(testimonials);
  };

  const updateTestimonial = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const testimonials = [...(content.testimonials || [])];
    testimonials[index] = {
      ...testimonials[index],
      [field]: value,
    };
    updateTestimonials(testimonials);
  };

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
      <div className="flex justify-between items-center">
        <Label className="text-xs uppercase font-bold text-muted-foreground">
          Testimonials
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTestimonial}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Testimonial
        </Button>
      </div>

      {/* Stats Section */}
      <div className="space-y-3 pt-3 border-t">
        <Label className="text-xs font-bold text-muted-foreground">
          Social Proof Stats
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground">
              Average Rating
            </Label>
            <Input
              value={content.stats?.averageRating || "4.9★"}
              onChange={(e) =>
                onChange({
                  stats: { ...content.stats, averageRating: e.target.value },
                })
              }
              placeholder="4.9★"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground">
              Reviews Count
            </Label>
            <Input
              value={content.stats?.reviewsCount || "127+"}
              onChange={(e) =>
                onChange({
                  stats: { ...content.stats, reviewsCount: e.target.value },
                })
              }
              placeholder="127+"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground">
              Satisfaction Rate
            </Label>
            <Input
              value={content.stats?.satisfactionRate || "98%"}
              onChange={(e) =>
                onChange({
                  stats: { ...content.stats, satisfactionRate: e.target.value },
                })
              }
              placeholder="98%"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground">
              Happy Customers
            </Label>
            <Input
              value={content.stats?.happyCustomers || "50K+"}
              onChange={(e) =>
                onChange({
                  stats: { ...content.stats, happyCustomers: e.target.value },
                })
              }
              placeholder="50K+"
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {(content.testimonials || []).map(
        (testimonial: Testimonial, index: number) => (
          <div
            key={index}
            className="space-y-2 p-3 bg-background rounded border"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold">Testimonial {index + 1}</span>
              <button
                onClick={() => removeTestimonial(index)}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Name
                </Label>
                <Input
                  value={testimonial.name || ""}
                  onChange={(e) =>
                    updateTestimonial(index, "name", e.target.value)
                  }
                  placeholder="Customer Name"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Role/Position
                </Label>
                <Input
                  value={testimonial.role || ""}
                  onChange={(e) =>
                    updateTestimonial(index, "role", e.target.value)
                  }
                  placeholder="CEO, Manager, etc."
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Company (Optional)
                </Label>
                <Input
                  value={testimonial.company || ""}
                  onChange={(e) =>
                    updateTestimonial(index, "company", e.target.value)
                  }
                  placeholder="Company Name"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Testimonial
                </Label>
                <Textarea
                  value={testimonial.testimonial || ""}
                  onChange={(e) =>
                    updateTestimonial(index, "testimonial", e.target.value)
                  }
                  placeholder="Enter testimonial text..."
                  className="text-xs min-h-[60px]"
                  rows={3}
                />
              </div>

              <div>
                <ImageUploadWithCrop
                  label="Customer Image"
                  currentImage={testimonial.image}
                  onImageUpdate={(url) =>
                    updateTestimonial(index, "image", url)
                  }
                  recommendedWidth={300}
                  recommendedHeight={300}
                  aspectRatio={1}
                  maxFileSize={3}
                  showDimensions={true}
                />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Rating
                </Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateTestimonial(index, "rating", star)}
                      className={cn(
                        "text-2xl transition-colors",
                        star <= (testimonial.rating || 0)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      )}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {(content.testimonials || []).length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No testimonials yet. Click "Add Testimonial" to create one.
        </p>
      )}
    </div>
  );
};

export default TestimonialsSettings;
