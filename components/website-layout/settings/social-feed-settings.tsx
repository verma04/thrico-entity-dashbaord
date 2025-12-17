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

interface SocialFeedSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const SocialFeedSettings = ({
  content,
  onChange,
  layout,
}: SocialFeedSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Platform</Label>
        <Select
          value={content.platform || "instagram"}
          onValueChange={(value) => onChange({ platform: value })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="twitter">Twitter/X</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="mixed">Mixed Platforms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Account Handle/Username</Label>
        <Input
          value={content.handle || ""}
          onChange={(e) => onChange({ handle: e.target.value })}
          placeholder="@yourhandle"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Feed URL or Embed Code</Label>
        <Textarea
          value={content.feedUrl || ""}
          onChange={(e) => onChange({ feedUrl: e.target.value })}
          placeholder="https://... or <script>...</script>"
          className="text-xs min-h-[60px]"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Number of Posts to Display</Label>
        <Input
          type="number"
          value={content.postCount || 6}
          onChange={(e) => onChange({ postCount: parseInt(e.target.value) || 6 })}
          placeholder="6"
          className="h-8 text-xs"
          min="1"
          max="20"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Hashtag Filter (optional)</Label>
        <Input
          value={content.hashtag || ""}
          onChange={(e) => onChange({ hashtag: e.target.value })}
          placeholder="#community"
          className="h-8 text-xs"
        />
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> You may need to configure API access or use third-party embed services
          to display live social feeds. Alternatively, manually curate posts in your CMS.
        </p>
      </div>
    </div>
  );
};
