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

interface DonationSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const DonationSettings = ({
  content,
  onChange,
  layout,
}: DonationSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Campaign Title</Label>
        <Input
          value={content.campaignTitle || ""}
          onChange={(e) => onChange({ campaignTitle: e.target.value })}
          placeholder="Support Our Mission"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Description</Label>
        <Textarea
          value={content.campaignDescription || ""}
          onChange={(e) => onChange({ campaignDescription: e.target.value })}
          placeholder="Explain what the donations will support..."
          className="text-xs min-h-[60px]"
          rows={3}
        />
      </div>

      {(layout === "goal-progress" || layout === "impact-showcase") && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground">Goal Amount</Label>
              <Input
                type="number"
                value={content.goalAmount || 0}
                onChange={(e) => onChange({ goalAmount: parseInt(e.target.value) || 0 })}
                placeholder="10000"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground">Current Amount</Label>
              <Input
                type="number"
                value={content.currentAmount || 0}
                onChange={(e) => onChange({ currentAmount: parseInt(e.target.value) || 0 })}
                placeholder="5000"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground">Currency</Label>
            <Select
              value={content.currency || "USD"}
              onValueChange={(value) => onChange({ currency: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Suggested Amounts (comma-separated)</Label>
        <Input
          value={(content.suggestedAmounts || []).join(", ")}
          onChange={(e) => {
            const amounts = e.target.value
              .split(",")
              .map((a) => parseInt(a.trim()))
              .filter((a) => !isNaN(a));
            onChange({ suggestedAmounts: amounts });
          }}
          placeholder="10, 25, 50, 100"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Payment Link/URL</Label>
        <Input
          value={content.paymentUrl || ""}
          onChange={(e) => onChange({ paymentUrl: e.target.value })}
          placeholder="https://donate.example.com"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Button Text</Label>
        <Input
          value={content.buttonText || "Donate Now"}
          onChange={(e) => onChange({ buttonText: e.target.value })}
          placeholder="Donate Now"
          className="h-8 text-xs"
        />
      </div>

      {layout === "supporter-wall" && (
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Recent Supporters (comma-separated names)</Label>
          <Textarea
            value={(content.supporters || []).join(", ")}
            onChange={(e) => {
              const supporters = e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              onChange({ supporters });
            }}
            placeholder="John D., Sarah M., Anonymous"
            className="text-xs min-h-[50px]"
            rows={2}
          />
        </div>
      )}

      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> Integrate with payment processors like Stripe, PayPal, or Razorpay
          for actual donation processing.
        </p>
      </div>
    </div>
  );
};
