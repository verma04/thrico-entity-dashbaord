import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface LocationMapSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const LocationMapSettings = ({
  content,
  onChange,
}: LocationMapSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Title</Label>
        <Input
          value={content.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Visit Our Flagship"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Description</Label>
        <Textarea
          value={content.description || ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="e.g. Come see us in person!"
          className="text-xs min-h-[50px]"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Address</Label>
        <Textarea
          value={content.address || ""}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="123 Main St, City, State, ZIP"
          className="text-xs min-h-[50px]"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Phone</Label>
          <Input
            value={content.phone || ""}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Email</Label>
          <Input
            value={content.email || ""}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="hello@example.com"
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Hours</Label>
        <Input
          value={content.hours || ""}
          onChange={(e) => onChange({ hours: e.target.value })}
          placeholder="e.g. Mon-Fri 9am-6pm"
          className="h-8 text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Latitude</Label>
          <Input
            type="number"
            step="0.000001"
            value={content.latitude || 0}
            onChange={(e) =>
              onChange({ latitude: parseFloat(e.target.value) || 0 })
            }
            placeholder="37.7749"
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Longitude</Label>
          <Input
            type="number"
            step="0.000001"
            value={content.longitude || 0}
            onChange={(e) =>
              onChange({ longitude: parseFloat(e.target.value) || 0 })
            }
            placeholder="-122.4194"
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">
          Google Maps Embed URL (optional)
        </Label>
        <Textarea
          value={content.embedUrl || ""}
          onChange={(e) => onChange({ embedUrl: e.target.value })}
          placeholder="https://www.google.com/maps/embed?..."
          className="text-xs min-h-[50px]"
          rows={2}
        />
      </div>
    </div>
  );
};
