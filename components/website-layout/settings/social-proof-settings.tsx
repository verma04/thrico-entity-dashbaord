import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SocialProofSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const SocialProofSettings = ({
  content,
  onChange,
}: SocialProofSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Rating</Label>
        <Input
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={content.rating || 5}
          onChange={(e) => onChange({ rating: parseFloat(e.target.value) || 5 })}
          placeholder="4.8"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Total Reviews</Label>
        <Input
          type="number"
          value={content.totalReviews || 0}
          onChange={(e) => onChange({ totalReviews: parseInt(e.target.value) || 0 })}
          placeholder="1250"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Trust Badges (comma-separated)</Label>
        <Textarea
          value={(content.badges || []).join(", ")}
          onChange={(e) => {
            const badges = e.target.value.split(",").map((b) => b.trim()).filter(Boolean);
            onChange({ badges });
          }}
          placeholder="Verified, Trusted, Award Winner"
          className="text-xs min-h-[50px]"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Customer Count</Label>
        <Input
          value={content.customerCount || ""}
          onChange={(e) => onChange({ customerCount: e.target.value })}
          placeholder="10,000+"
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
};
