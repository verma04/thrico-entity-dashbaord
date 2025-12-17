import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface LogoCloudSettingsProps {
  content: {
    logos?: Array<{
      name: string;
      image: string;
      website?: string;
    }>;
    title?: string;
    description?: string;
    backgroundColor?: string;
  };
  onChange: (updates: any) => void;
}

const LogoCloudSettings: React.FC<LogoCloudSettingsProps> = ({
  content,
  onChange,
}) => {
  const {
    logos = [
      {
        name: "Microsoft",
        image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=400&h=200&fit=crop",
        website: "https://microsoft.com",
      },
      {
        name: "Google",
        image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=200&fit=crop",
        website: "https://google.com",
      },
      {
        name: "Apple",
        image: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=400&h=200&fit=crop",
        website: "https://apple.com",
      },
      {
        name: "Amazon",
        image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=200&fit=crop",
        website: "https://amazon.com",
      },
      { 
        name: "Meta", 
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop", 
        website: "https://meta.com" 
      },
      {
        name: "Tesla",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=200&fit=crop",
        website: "https://tesla.com",
      },
    ],
    title = "Trusted by Industry Leaders",
    description = "Join thousands of companies that trust our platform",
    backgroundColor = "#ffffff",
  } = content;

  const addLogo = () => {
    const newLogos = [
      ...logos,
      {
        name: "New Company",
        image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=200&fit=crop",
        website: "https://example.com",
      },
    ];
    onChange({ logos: newLogos });
  };

  const updateLogo = (index: number, updates: Partial<(typeof logos)[0]>) => {
    const newLogos = logos.map((logo, i) =>
      i === index ? { ...logo, ...updates } : logo
    );
    onChange({ logos: newLogos });
  };

  const removeLogo = (index: number) => {
    const newLogos = logos.filter((_, i) => i !== index);
    onChange({ logos: newLogos });
  };

  return (
    <div className="space-y-6">
     

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Company Logos</Label>
          <Button onClick={addLogo} size="sm">
            Add Logo
          </Button>
        </div>

        <div className="space-y-4">
          {logos.map((logo, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Logo #{index + 1}</span>
                <Button
                  onClick={() => removeLogo(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">Company Name</Label>
                  <Input
                    value={logo.name}
                    onChange={(e) =>
                      updateLogo(index, { name: e.target.value })
                    }
                    placeholder="Company Name"
                  />
                </div>

                <ImageUploadWithCrop
                  currentImage={logo.image}
                  onImageUpdate={(url) =>
                    updateLogo(index, { image: url })
                  }
                  label="Company Logo"
                  recommendedWidth={400}
                  recommendedHeight={200}
                  aspectRatio={2 / 1}
                  maxFileSize={2}
                  showDimensions={true}
                />

                <div>
                  <Label className="text-xs text-gray-600">
                    Website URL (Optional)
                  </Label>
                  <Input
                    value={logo.website || ""}
                    onChange={(e) =>
                      updateLogo(index, { website: e.target.value })
                    }
                    placeholder="https://company.com"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCloudSettings;
