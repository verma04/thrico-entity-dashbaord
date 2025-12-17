import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface TeamSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const TeamSettings: React.FC<TeamSettingsProps> = ({
  content,
  onChange,
}) => {
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
      <Label className="text-xs uppercase font-bold text-muted-foreground">
        Team Members
      </Label>

    

      {/* Team Members */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold">Team Members</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const members = [...(content.members || [])];
              members.push({
                name: "",
                role: "",
                bio: "",
                image: "",
                email: "",
                linkedin: "",
                twitter: "",
              });
              onChange({ members });
            }}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Member
          </Button>
        </div>

        {(content.members || []).map((member: any, index: number) => (
          <div
            key={index}
            className="space-y-2 p-3 bg-background rounded border"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">Member {index + 1}</span>
              <button
                onClick={() => {
                  const members = [...(content.members || [])];
                  members.splice(index, 1);
                  onChange({ members });
                }}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  value={member.name || ""}
                  onChange={(e) => {
                    const members = [...(content.members || [])];
                    members[index] = {
                      ...members[index],
                      name: e.target.value,
                    };
                    onChange({ members });
                  }}
                  placeholder="John Doe"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Role/Position
                </Label>
                <Input
                  value={member.role || ""}
                  onChange={(e) => {
                    const members = [...(content.members || [])];
                    members[index] = {
                      ...members[index],
                      role: e.target.value,
                    };
                    onChange({ members });
                  }}
                  placeholder="CEO & Founder"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Bio/Description
              </Label>
              <Textarea
                value={member.bio || ""}
                onChange={(e) => {
                  const members = [...(content.members || [])];
                  members[index] = {
                    ...members[index],
                    bio: e.target.value,
                  };
                  onChange({ members });
                }}
                placeholder="Brief biography and background..."
                className="text-xs min-h-[60px]"
                rows={3}
              />
            </div>

            <div>
              <ImageUploadWithCrop
                label="Profile Image"
                currentImage={member.image}
                onImageUpdate={(url) => {
                  const members = [...(content.members || [])];
                  members[index] = {
                    ...members[index],
                    image: url,
                  };
                  onChange({ members });
                }}
                recommendedWidth={400}
                recommendedHeight={400}
                aspectRatio={1}
                maxFileSize={5}
                showDimensions={true}
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Email (Optional)
              </Label>
              <Input
                value={member.email || ""}
                onChange={(e) => {
                  const members = [...(content.members || [])];
                  members[index] = {
                    ...members[index],
                    email: e.target.value,
                  };
                  onChange({ members });
                }}
                placeholder="john@example.com"
                className="h-8 text-xs"
                type="email"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  LinkedIn (Optional)
                </Label>
                <Input
                  value={member.linkedin || ""}
                  onChange={(e) => {
                    const members = [...(content.members || [])];
                    members[index] = {
                      ...members[index],
                      linkedin: e.target.value,
                    };
                    onChange({ members });
                  }}
                  placeholder="https://linkedin.com/in/..."
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Twitter (Optional)
                </Label>
                <Input
                  value={member.twitter || ""}
                  onChange={(e) => {
                    const members = [...(content.members || [])];
                    members[index] = {
                      ...members[index],
                      twitter: e.target.value,
                    };
                    onChange({ members });
                  }}
                  placeholder="https://twitter.com/..."
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        ))}

        {(content.members || []).length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No team members yet. Click "Add Member" to create one.
          </p>
        )}
      </div>

      {/* Department Grouping */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs font-bold">Department Organization</Label>
        <div>
          <Label className="text-[10px] text-muted-foreground">
            Show Members by Department
          </Label>
          <label className="flex items-center space-x-2 mt-1">
            <input
              type="checkbox"
              checked={content.groupByDepartment || false}
              onChange={(e) =>
                onChange({ groupByDepartment: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-xs">Group members by department</span>
          </label>
        </div>

        {content.groupByDepartment && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] text-muted-foreground">
                Departments
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const departments = [...(content.departments || [])];
                  departments.push({
                    name: "",
                    description: "",
                  });
                  onChange({ departments });
                }}
                className="h-6 text-[10px] px-2"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Dept
              </Button>
            </div>

            {(content.departments || []).map((dept: any, index: number) => (
              <div key={index} className="flex gap-2 p-2 bg-muted/20 rounded">
                <Input
                  value={dept.name || ""}
                  onChange={(e) => {
                    const departments = [...(content.departments || [])];
                    departments[index] = {
                      ...departments[index],
                      name: e.target.value,
                    };
                    onChange({ departments });
                  }}
                  placeholder="Department name"
                  className="h-7 text-xs flex-1"
                />
                <button
                  onClick={() => {
                    const departments = [...(content.departments || [])];
                    departments.splice(index, 1);
                    onChange({ departments });
                  }}
                  className="text-red-500 hover:bg-red-50 p-1 rounded text-xs"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
