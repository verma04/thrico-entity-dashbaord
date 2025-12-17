import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface GuidelinesSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const GuidelinesSettings = ({
  content,
  onChange,
}: GuidelinesSettingsProps) => {
  const guidelines = content.guidelines || [];

  const addGuideline = () => {
    const newGuidelines = [
      ...guidelines,
      { title: "", description: "" },
    ];
    onChange({ guidelines: newGuidelines });
  };

  const updateGuideline = (index: number, field: string, value: any) => {
    const newGuidelines = [...guidelines];
    newGuidelines[index] = { ...newGuidelines[index], [field]: value };
    onChange({ guidelines: newGuidelines });
  };

  const deleteGuideline = (index: number) => {
    const newGuidelines = guidelines.filter((_: any, i: number) => i !== index);
    onChange({ guidelines: newGuidelines });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-xs uppercase font-bold text-muted-foreground">
          Guidelines
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addGuideline}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Guideline
        </Button>
      </div>

      {guidelines.map((guideline: any, index: number) => (
        <div key={index} className="space-y-2 p-3 bg-muted/10 rounded border">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold">Guideline {index + 1}</span>
            <button
              onClick={() => deleteGuideline(index)}
              className="text-red-500 hover:bg-red-50 p-1 rounded"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground">Title</Label>
            <Input
              value={guideline.title || ""}
              onChange={(e) => updateGuideline(index, "title", e.target.value)}
              placeholder="Be Respectful"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground">Description</Label>
            <Textarea
              value={guideline.description || ""}
              onChange={(e) => updateGuideline(index, "description", e.target.value)}
              placeholder="Explain the guideline..."
              className="text-xs min-h-[50px]"
              rows={2}
            />
          </div>
        </div>
      ))}

      {guidelines.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No guidelines yet. Click "Add Guideline" to create one.
        </p>
      )}
    </div>
  );
};
