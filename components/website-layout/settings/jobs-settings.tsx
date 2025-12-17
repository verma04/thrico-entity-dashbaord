import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { Plus, Trash2 } from "lucide-react";

interface JobsSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const JobsSettings = ({
  content,
  onChange,
}: JobsSettingsProps) => {
  const jobs = content.jobs || [];

  const addJob = () => {
    const newJobs = [
      ...jobs,
      {
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: "",
        logo: "",
        tags: [],
      },
    ];
    onChange({ jobs: newJobs });
  };

  const updateJob = (index: number, field: string, value: any) => {
    const newJobs = [...jobs];
    newJobs[index] = { ...newJobs[index], [field]: value };
    onChange({ jobs: newJobs });
  };

  const deleteJob = (index: number) => {
    const newJobs = jobs.filter((_: any, i: number) => i !== index);
    onChange({ jobs: newJobs });
  };

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
      <div className="flex justify-between items-center">
        <Label className="text-xs uppercase font-bold text-muted-foreground">
          Job Listings
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addJob}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Job
        </Button>
      </div>

      {jobs.map((job: any, index: number) => (
        <div
          key={index}
          className="space-y-2 p-3 bg-background rounded border"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold">Job {index + 1}</span>
            <button
              onClick={() => deleteJob(index)}
              className="text-red-500 hover:bg-red-50 p-1 rounded"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">
                Job Title
              </Label>
              <Input
                value={job.title || ""}
                onChange={(e) => updateJob(index, "title", e.target.value)}
                placeholder="Software Engineer"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Company
              </Label>
              <Input
                value={job.company || ""}
                onChange={(e) => updateJob(index, "company", e.target.value)}
                placeholder="Company Name"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Location
              </Label>
              <Input
                value={job.location || ""}
                onChange={(e) => updateJob(index, "location", e.target.value)}
                placeholder="Remote / City"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Job Type
              </Label>
              <Input
                value={job.type || ""}
                onChange={(e) => updateJob(index, "type", e.target.value)}
                placeholder="Full-time"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-[10px] text-muted-foreground">
              Salary (Optional)
            </Label>
            <Input
              value={job.salary || ""}
              onChange={(e) => updateJob(index, "salary", e.target.value)}
              placeholder="$80k - $120k"
              className="h-8 text-xs"
            />
          </div>

          <div>
            <Label className="text-[10px] text-muted-foreground">
              Description
            </Label>
            <Textarea
              value={job.description || ""}
              onChange={(e) => updateJob(index, "description", e.target.value)}
              placeholder="Job description..."
              className="text-xs min-h-[50px]"
              rows={2}
            />
          </div>

          <div>
            <ImageUploadWithCrop
              currentImage={job.logo}
              onImageUpdate={(imageUrl) => updateJob(index, "logo", imageUrl)}
              label="Company Logo"
              recommendedWidth={200}
              recommendedHeight={200}
              aspectRatio={1}
              maxFileSize={5}
              showDimensions={true}
            />
          </div>

          <div>
            <Label className="text-[10px] text-muted-foreground">
              Tags (comma-separated)
            </Label>
            <Input
              value={(job.tags || []).join(", ")}
              onChange={(e) => {
                const tags = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                updateJob(index, "tags", tags);
              }}
              placeholder="React, TypeScript, Node.js"
              className="h-8 text-xs"
            />
          </div>
        </div>
      ))}

      {jobs.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No jobs yet. Click "Add Job" to create one.
        </p>
      )}
    </div>
  );
};
