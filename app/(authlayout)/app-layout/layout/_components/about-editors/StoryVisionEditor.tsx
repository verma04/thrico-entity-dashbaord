import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface StoryVisionEditorProps {
  content: any;
  onUpdate: (updates: any) => void;
}

export const StoryVisionEditor = ({ content, onUpdate }: StoryVisionEditorProps) => {
  return (
    <div className="space-y-2 pt-2 border-t">
      <Label className="text-xs font-bold">Story & Vision Fields</Label>
      
      <div>
        <Label className="text-[10px] text-muted-foreground">Story Text</Label>
        <Textarea 
          value={content.story || ""} 
          onChange={(e) => onUpdate({ story: e.target.value })} 
          placeholder="Our journey began..."
          className="text-xs min-h-[60px]"
          rows={3}
        />
      </div>
      
      <div>
        <Label className="text-[10px] text-muted-foreground">Vision Statement</Label>
        <Textarea 
          value={content.vision || ""} 
          onChange={(e) => onUpdate({ vision: e.target.value })} 
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
            onClick={() => {
              const milestones = content.milestones || [];
              onUpdate({
                milestones: [...milestones, { year: "2024", event: "New Milestone" }]
              });
            }}
            className="h-6 text-[10px]"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Milestone
          </Button>
        </div>
        
        <div className="space-y-2">
          {(content.milestones || []).map((milestone: any, index: number) => (
            <div key={index} className="border rounded p-2 bg-muted/5">
              <div className="flex justify-between items-start mb-2">
                <Label className="text-[9px] text-muted-foreground">Milestone {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const milestones = [...(content.milestones || [])];
                    milestones.splice(index, 1);
                    onUpdate({ milestones });
                  }}
                  className="h-5 w-5 p-0 hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[9px] text-muted-foreground">Year</Label>
                  <Input 
                    value={milestone.year || ""} 
                    onChange={(e) => {
                      const milestones = [...(content.milestones || [])];
                      milestones[index] = { ...milestone, year: e.target.value };
                      onUpdate({ milestones });
                    }}
                    placeholder="2024"
                    className="h-7 text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-[9px] text-muted-foreground">Event</Label>
                  <Input 
                    value={milestone.event || ""} 
                    onChange={(e) => {
                      const milestones = [...(content.milestones || [])];
                      milestones[index] = { ...milestone, event: e.target.value };
                      onUpdate({ milestones });
                    }}
                    placeholder="Founded"
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {(content.milestones || []).length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              No milestones yet. Click "Add Milestone" to create one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
