import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FounderMessageEditorProps {
  content: any;
  onUpdate: (updates: any) => void;
}

export const FounderMessageEditor = ({ content, onUpdate }: FounderMessageEditorProps) => {
  return (
    <div className="space-y-2 pt-2 border-t">
      <Label className="text-xs font-bold">Founder Details</Label>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px] text-muted-foreground">Founder Name</Label>
          <Input 
            value={content.founderName || ""} 
            onChange={(e) => onUpdate({ founderName: e.target.value })} 
            placeholder="John Doe"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Title</Label>
          <Input 
            value={content.founderTitle || ""} 
            onChange={(e) => onUpdate({ founderTitle: e.target.value })} 
            placeholder="Founder & CEO"
            className="h-8 text-xs"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-[10px] text-muted-foreground">Message</Label>
        <Textarea 
          value={content.message || ""} 
          onChange={(e) => onUpdate({ message: e.target.value })} 
          placeholder="When we started this journey..."
          className="text-xs min-h-[80px]"
          rows={4}
        />
      </div>
      
      <div>
        <Label className="text-[10px] text-muted-foreground">Founder Image URL</Label>
        <Input 
          value={content.founderImage || ""} 
          onChange={(e) => onUpdate({ founderImage: e.target.value })} 
          placeholder="https://..."
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
};
