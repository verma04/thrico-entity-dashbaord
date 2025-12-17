import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface SocialLinksEditorProps {
  links?: { platform: string; url: string }[];
  onChange: (links: { platform: string; url: string }[]) => void;
}

export const SocialLinksEditor = ({
  links,
  onChange,
}: SocialLinksEditorProps) => {
  const addLink = () => {
    onChange([...(links || []), { platform: "twitter", url: "https://" }]);
  };

  const removeLink = (index: number) => {
    const newLinks = [...(links || [])];
    newLinks.splice(index, 1);
    onChange(newLinks);
  };

  const updateLink = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    const newLinks = [...(links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
      <Label className="text-xs uppercase font-bold text-muted-foreground">
        Social Links
      </Label>
      <div className="space-y-2">
        {links?.map((link, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Select
              value={link.platform}
              onValueChange={(val) => updateLink(index, "platform", val)}
            >
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "twitter",
                  "facebook",
                  "linkedin",
                  "instagram",
                  "github",
                  "youtube",
                  "discord",
                  "tiktok",
                ].map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={link.url}
              onChange={(e) => updateLink(index, "url", e.target.value)}
              className="h-8 text-xs flex-1"
              placeholder="https://..."
            />
            <button
              onClick={() => removeLink(index)}
              className="p-2 hover:bg-red-100 text-red-500 rounded"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <Button
        onClick={addLink}
        variant="outline"
        size="sm"
        className="w-full text-xs h-8 dashed border-muted-foreground/50"
      >
        <Plus className="h-3 w-3 mr-2" /> Add Social Link
      </Button>
    </div>
  );
};
