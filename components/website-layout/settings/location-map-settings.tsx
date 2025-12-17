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
        <Label className="text-[10px] text-muted-foreground">Location Name</Label>
        <Input
          value={content.locationName || ""}
          onChange={(e) => onChange({ locationName: e.target.value })}
          placeholder="Our Office"
          className="h-8 text-xs"
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
          <Label className="text-[10px] text-muted-foreground">Latitude</Label>
          <Input
            type="number"
            step="0.000001"
            value={content.latitude || 0}
            onChange={(e) => onChange({ latitude: parseFloat(e.target.value) || 0 })}
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
            onChange={(e) => onChange({ longitude: parseFloat(e.target.value) || 0 })}
            placeholder="-122.4194"
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Google Maps Embed URL (optional)</Label>
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
