import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ImpactGrowthEditorProps {
  content: any;
  onUpdate: (updates: any) => void;
}

export const ImpactGrowthEditor = ({ content, onUpdate }: ImpactGrowthEditorProps) => {
  return (
    <div className="space-y-2 pt-2 border-t">
      <Label className="text-xs font-bold">Impact & Growth Content</Label>
      
      <div>
        <Label className="text-[10px] text-muted-foreground">Subtitle</Label>
        <Input 
          value={content.subtitle || ""} 
          onChange={(e) => onUpdate({ subtitle: e.target.value })} 
          placeholder="Measuring success through community growth"
          className="h-8 text-xs"
        />
      </div>
      
      {/* Stats/KPI Editor */}
      <div className="pt-2 border-t">
        <div className="flex justify-between items-center mb-2">
          <Label className="text-xs font-bold">Key Stats (KPIs)</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const stats = content.stats || [];
              onUpdate({
                stats: [...stats, { value: "100+", label: "Metric", icon: "TrendingUp" }]
              });
            }}
            className="h-6 text-[10px]"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Stat
          </Button>
        </div>
        
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {(content.stats || []).map((stat: any, index: number) => (
            <div key={index} className="border rounded p-2 bg-muted/5">
              <div className="flex justify-between items-start mb-2">
                <Label className="text-[9px] text-muted-foreground">Stat {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const stats = [...(content.stats || [])];
                    stats.splice(index, 1);
                    onUpdate({ stats });
                  }}
                  className="h-5 w-5 p-0 hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[9px] text-muted-foreground">Value</Label>
                  <Input 
                    value={stat.value || ""} 
                    onChange={(e) => {
                      const stats = [...(content.stats || [])];
                      stats[index] = { ...stat, value: e.target.value };
                      onUpdate({ stats });
                    }}
                    placeholder="50K+"
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[9px] text-muted-foreground">Label</Label>
                  <Input 
                    value={stat.label || ""} 
                    onChange={(e) => {
                      const stats = [...(content.stats || [])];
                      stats[index] = { ...stat, label: e.target.value };
                      onUpdate({ stats });
                    }}
                    placeholder="Members"
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[9px] text-muted-foreground">Icon</Label>
                  <Input 
                    value={stat.icon || ""} 
                    onChange={(e) => {
                      const stats = [...(content.stats || [])];
                      stats[index] = { ...stat, icon: e.target.value };
                      onUpdate({ stats });
                    }}
                    placeholder="Users"
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
          {(content.stats || []).length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">No stats yet.</p>
          )}
        </div>
      </div>
      
      {/* Achievements Editor */}
      <div className="pt-2 border-t">
        <div className="flex justify-between items-center mb-2">
          <Label className="text-xs font-bold">Key Achievements</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const achievements = content.achievements || [];
              onUpdate({
                achievements: [...achievements, { year: "2024", title: "Achievement", description: "Description" }]
              });
            }}
            className="h-6 text-[10px]"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Achievement
          </Button>
        </div>
        
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {(content.achievements || []).map((achievement: any, index: number) => (
            <div key={index} className="border rounded p-2 bg-muted/5">
              <div className="flex justify-between items-start mb-2">
                <Label className="text-[9px] text-muted-foreground">Achievement {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const achievements = [...(content.achievements || [])];
                    achievements.splice(index, 1);
                    onUpdate({ achievements });
                  }}
                  className="h-5 w-5 p-0 hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-[9px] text-muted-foreground">Year</Label>
                    <Input 
                      value={achievement.year || ""} 
                      onChange={(e) => {
                        const achievements = [...(content.achievements || [])];
                        achievements[index] = { ...achievement, year: e.target.value };
                        onUpdate({ achievements });
                      }}
                      placeholder="2024"
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[9px] text-muted-foreground">Title</Label>
                    <Input 
                      value={achievement.title || ""} 
                      onChange={(e) => {
                        const achievements = [...(content.achievements || [])];
                        achievements[index] = { ...achievement, title: e.target.value };
                        onUpdate({ achievements });
                      }}
                      placeholder="Best Platform Award"
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[9px] text-muted-foreground">Description</Label>
                  <Textarea 
                    value={achievement.description || ""} 
                    onChange={(e) => {
                      const achievements = [...(content.achievements || [])];
                      achievements[index] = { ...achievement, description: e.target.value };
                      onUpdate({ achievements });
                    }}
                    placeholder="Recognized for innovation..."
                    className="text-xs min-h-[40px]"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
          {(content.achievements || []).length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">No achievements yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
