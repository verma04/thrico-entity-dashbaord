import sys

filename = '/Users/pulseplay/thrico/thrico-entity-dashboard/components/rewards/coupons/form/reward-form-sections.tsx'
with open(filename, 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if 'Supply Chain Type' in line:
        # Find the wrapping div for the flex container
        for j in range(i, i-10, -1):
            if '<div className="flex items-center justify-between">' in lines[j]:
                start_idx = j
                break
        break

if start_idx != -1:
    open_divs = 0
    for i in range(start_idx, len(lines)):
        open_divs += lines[i].count('<div')
        open_divs -= lines[i].count('</div')
        if open_divs == 0:
            end_idx = i
            break

print(f"Start: {start_idx}, End: {end_idx}")

replacement = """          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-foreground">
                  Coupon Type
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  One to One: Requires unique voucher codes. One to Many: Single global code.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 w-64">
                <Select
                  value={formik.values.inventoryRequired ? "ONE_TO_ONE" : "ONE_TO_MANY"}
                  onValueChange={(v) => {
                    formik.setFieldValue("inventoryRequired", v === "ONE_TO_ONE");
                    if (v === "ONE_TO_ONE") {
                      formik.setFieldValue("couponCode", "");
                    }
                  }}
                  disabled={(() => {
                    const selected = Array.isArray(formik.values.rewardMechanism)
                      ? formik.values.rewardMechanism
                      : formik.values.rewardMechanism
                        ? [formik.values.rewardMechanism]
                        : [];
                    return selected.some((m: string) => ["SPIN_WHEEL", "SCRATCH_CARD", "MATCH_AND_WIN"].includes(m));
                  })()}
                >
                  <SelectTrigger className="bg-white dark:bg-muted/10 border-border/40 text-[11px] font-bold h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONE_TO_ONE" className="text-[11px]">One to One (Inventory)</SelectItem>
                    <SelectItem value="ONE_TO_MANY" className="text-[11px]">One to Many (Manual)</SelectItem>
                  </SelectContent>
                </Select>
                {(() => {
                  const selected = Array.isArray(formik.values.rewardMechanism)
                    ? formik.values.rewardMechanism
                    : formik.values.rewardMechanism
                      ? [formik.values.rewardMechanism]
                      : [];
                  if (selected.some((m: string) => ["SPIN_WHEEL", "SCRATCH_CARD", "MATCH_AND_WIN"].includes(m))) {
                    return (
                      <p className="text-[9px] text-amber-600/80 dark:text-amber-500/80 text-right pr-2">
                        Forced to One-to-Many for games to prevent errors.
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            {!formik.values.inventoryRequired && (
              <div className="space-y-2 pt-4 border-t border-border/20">
                <Label
                  htmlFor="couponCode"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Global Coupon Code
                </Label>
                <Input
                  id="couponCode"
                  placeholder="e.g. SUMMER50"
                  className="bg-white dark:bg-muted/10 border-border/40 focus:ring-1 focus:ring-indigo-500/20"
                  {...formik.getFieldProps("couponCode")}
                />
                <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                  Enter the single code that all members will use to redeem this reward.
                </p>
                {err("couponCode")}
              </div>
            )}
          </div>
"""

if start_idx != -1 and end_idx != -1:
    lines = lines[:start_idx] + [replacement] + lines[end_idx+1:]
    with open(filename, 'w') as f:
        f.writelines(lines)
    print("Replaced successfully")
else:
    print("Could not find bounds")

