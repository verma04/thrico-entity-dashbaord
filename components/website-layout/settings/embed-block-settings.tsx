import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EmbedBlockSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const EmbedBlockSettings = ({
  content,
  onChange,
}: EmbedBlockSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Embed Code (HTML/iframe)</Label>
        <Textarea
          value={content.embedCode || ""}
          onChange={(e) => onChange({ embedCode: e.target.value })}
          placeholder="<iframe src=... or <script>..."
          className="text-xs min-h-[150px] font-mono"
          rows={8}
        />
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-amber-700 dark:text-amber-300">
          <strong>Warning:</strong> Only embed code from trusted sources. Malicious code can compromise security.
        </p>
      </div>
    </div>
  );
};
