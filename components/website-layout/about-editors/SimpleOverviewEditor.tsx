import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SimpleOverviewEditorProps {
  content: any;
  onUpdate: (updates: any) => void;
}

export const SimpleOverviewEditor = ({ content, onUpdate }: SimpleOverviewEditorProps) => {
  return (
    <div className="space-y-2 pt-2 border-t">
      <Label className="text-xs font-bold">Overview Content</Label>
      
      <div>
        <Label className="text-[10px] text-muted-foreground">Introduction</Label>
        <Textarea 
          value={content.intro || ""} 
          onChange={(e) => onUpdate({ intro: e.target.value })} 
          placeholder="Founded in 2020, we've been dedicated to..."
          className="text-xs min-h-[60px]"
          rows={3}
        />
      </div>
      
      {/* Quick Stats Editor */}
      <div className="pt-2 border-t">
        <div className="flex justify-between items-center mb-2">
          <Label className="text-xs font-bold">Quick Stats (3 stats)</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const quickStats = content.quickStats || [];
              onUpdate({
                quickStats: [...quickStats, { value: "100+", label: "Metric" }]
              });
            }}
            className="h-6 text-[10px]"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Stat
          </Button>
        </div>
        
        <div className="space-y-2">
          {(content.quickStats || []).map((stat: any, index: number) => (
            <div key={index} className="border rounded p-2 bg-muted/5">
              <div className="flex justify-between items-start mb-2">
                <Label className="text-[9px] text-muted-foreground">Stat {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const quickStats = [...(content.quickStats || [])];
                    quickStats.splice(index, 1);
                    onUpdate({ quickStats });
                  }}
                  className="h-5 w-5 p-0 hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[9px] text-muted-foreground">Value</Label>
                  <Input 
                    value={stat.value || ""} 
                    onChange={(e) => {
                      const quickStats = [...(content.quickStats || [])];
                      quickStats[index] = { ...stat, value: e.target.value };
                      onUpdate({ quickStats });
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
                      const quickStats = [...(content.quickStats || [])];
                      quickStats[index] = { ...stat, label: e.target.value };
                      onUpdate({ quickStats });
                    }}
                    placeholder="Members"
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Features Editor */}
      <div className="pt-2 border-t">
        <div className="flex justify-between items-center mb-2">
          <Label className="text-xs font-bold">What We Do (Features)</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const features = content.features || [];
              onUpdate({
                features: [...features, { icon: "Users", title: "Feature", description: "Description" }]
              });
            }}
            className="h-6 text-[10px]"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Feature
          </Button>
        </div>
        
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {(content.features || []).map((feature: any, index: number) => (
            <div key={index} className="border rounded p-2 bg-muted/5">
              <div className="flex justify-between items-start mb-2">
                <Label className="text-[9px] text-muted-foreground">Feature {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const features = [...(content.features || [])];
                    features.splice(index, 1);
                    onUpdate({ features });
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
                      value={feature.icon || ""} 
                      onChange={(e) => {
                        const features = [...(content.features || [])];
                        features[index] = { ...feature, icon: e.target.value };
                        onUpdate({ features });
                      }}
                      placeholder="Users"
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[9px] text-muted-foreground">Title</Label>
                    <Input 
                      value={feature.title || ""} 
                      onChange={(e) => {
                        const features = [...(content.features || [])];
                        features[index] = { ...feature, title: e.target.value };
                        onUpdate({ features });
                      }}
                      placeholder="Community Building"
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[9px] text-muted-foreground">Description</Label>
                  <Textarea 
                    value={feature.description || ""} 
                    onChange={(e) => {
                      const features = [...(content.features || [])];
                      features[index] = { ...feature, description: e.target.value };
                      onUpdate({ features });
                    }}
                    placeholder="Tools to create and manage..."
                    className="text-xs min-h-[40px]"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Button Customization */}
      <div className="pt-2 border-t">
        <Label className="text-xs font-bold">Call-to-Action Button</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <Label className="text-[9px] text-muted-foreground">Button Text</Label>
            <Input 
              value={content.ctaText || ""} 
              onChange={(e) => onUpdate({ ctaText: e.target.value })} 
              placeholder="Get Started"
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-[9px] text-muted-foreground">Button Link</Label>
            <Input 
              value={content.ctaHref || ""} 
              onChange={(e) => onUpdate({ ctaHref: e.target.value })} 
              placeholder="/signup"
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
