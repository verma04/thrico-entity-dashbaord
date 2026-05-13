import sys

filename = '/Users/pulseplay/thrico/thrico-entity-dashboard/components/rewards/coupons/form/reward-form-sections.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_label = '''<Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Reward Mechanism
                </Label>'''

new_label = '''<div className="space-y-1">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                    Reward Mechanism
                  </Label>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Click an option to select or unselect. You can choose multiple ways to distribute this reward.
                  </p>
                </div>'''

content = content.replace(old_label, new_label)

with open(filename, 'w') as f:
    f.write(content)

print("Help text added")
