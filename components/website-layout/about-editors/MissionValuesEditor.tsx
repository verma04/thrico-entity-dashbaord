import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface MissionValuesEditorProps {
  content: any;
  onUpdate: (updates: any) => void;
}

export const MissionValuesEditor = ({ content, onUpdate }: MissionValuesEditorProps) => {
  return (
    <div className="space-y-2 pt-2 border-t">
      <Label className="text-xs font-bold">Mission & Values</Label>
      
      <div>
        <Label className="text-[10px] text-muted-foreground">Mission Statement</Label>
        <Textarea 
          value={content.mission || ""} 
          onChange={(e) => onUpdate({ mission: e.target.value })} 
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
            onClick={() => {
              const values = content.values || [];
              onUpdate({
                values: [...values, { icon: "Heart", title: "New Value", description: "Description here" }]
              });
            }}
            className="h-6 text-[10px]"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Value
          </Button>
        </div>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {(content.values || []).map((value: any, index: number) => (
            <div key={index} className="border rounded p-2 bg-muted/5">
              <div className="flex justify-between items-start mb-2">
                <Label className="text-[9px] text-muted-foreground">Value {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const values = [...(content.values || [])];
                    values.splice(index, 1);
                    onUpdate({ values });
                  }}
                  className="h-5 w-5 p-0 hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[9px] text-muted-foreground">Icon</Label>
                    <Input 
                      value={value.icon || ""} 
                      onChange={(e) => {
                        const values = [...(content.values || [])];
                        values[index] = { ...value, icon: e.target.value };
                        onUpdate({ values });
                      }}
                      placeholder="Heart"
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[9px] text-muted-foreground">Title</Label>
                    <Input 
                      value={value.title || ""} 
                      onChange={(e) => {
                        const values = [...(content.values || [])];
                        values[index] = { ...value, title: e.target.value };
                        onUpdate({ values });
                      }}
                      placeholder="Community First"
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[9px] text-muted-foreground">Description</Label>
                  <Textarea 
                    value={value.description || ""} 
                    onChange={(e) => {
                      const values = [...(content.values || [])];
                      values[index] = { ...value, description: e.target.value };
                      onUpdate({ values });
                    }}
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
  );
};
