import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalloutSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const CalloutSettings = ({
  content,
  onChange,
}: CalloutSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Callout Type</Label>
        <Select
          value={content.type || "info"}
          onValueChange={(value) => onChange({ type: value })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="tip">Tip</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Heading</Label>
        <Input
          value={content.heading || ""}
          onChange={(e) => onChange({ heading: e.target.value })}
          placeholder="Important Note"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Message</Label>
        <Textarea
          value={content.message || ""}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Your callout message..."
          className="text-xs min-h-[60px]"
          rows={3}
        />
      </div>
    </div>
  );
};
