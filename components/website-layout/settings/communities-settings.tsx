import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface Community {
  name?: string;
  description?: string;
  image?: string;
}

interface CommunitiesSettingsProps {
  content: {
    communities?: Community[];
    [key: string]: any;
  };
  onChange: (updates: any) => void;
}

const CommunitiesSettings: React.FC<CommunitiesSettingsProps> = ({
  content,
  onChange,
}) => {
  const updateCommunities = (communities: Community[]) => {
    onChange({ communities });
  };

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
      <Label className="text-xs uppercase font-bold text-muted-foreground">
        Communities
      </Label>

      {[1, 2, 3, 4, 5, 6].map((i) => {
        const community = (content.communities || [])[i - 1] || {};

        return (
          <div key={i} className="space-y-2 p-3 bg-background rounded border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold">Community {i}</span>
            </div>

            <div className="space-y-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Name
                </Label>
                <Input
                  value={community.name || ""}
                  onChange={(e) => {
                    const communities = [...(content.communities || [])];
                    communities[i - 1] = {
                      ...communities[i - 1],
                      name: e.target.value,
                    };
                    updateCommunities(communities);
                  }}
                  placeholder={`Community ${i}`}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Description
                </Label>
                <Input
                  value={community.description || ""}
                  onChange={(e) => {
                    const communities = [...(content.communities || [])];
                    communities[i - 1] = {
                      ...communities[i - 1],
                      description: e.target.value,
                    };
                    updateCommunities(communities);
                  }}
                  placeholder="Community description"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <ImageUploadWithCrop
                  currentImage={community.image}
                  onImageUpdate={(imageUrl) => {
                    const communities = [...(content.communities || [])];
                    communities[i - 1] = {
                      ...communities[i - 1],
                      image: imageUrl,
                    };
                    updateCommunities(communities);
                  }}
                  label="Community Image"
                  recommendedWidth={400}
                  recommendedHeight={400}
                  aspectRatio={1}
                  maxFileSize={5}
                  showDimensions={true}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );
      })}

      <p className="text-[10px] text-muted-foreground">
        Leave fields empty to use defaults
      </p>
    </div>
  );
};

export default CommunitiesSettings;
