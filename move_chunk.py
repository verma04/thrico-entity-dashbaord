import re

with open("components/rewards/coupons/form/reward-form-sections.tsx", "r") as f:
    lines = f.readlines()

# The chunk to extract starts at line 104 and ends at 342 (1-based index)
# But wait, let's find the exact indices by matching strings to be robust.

start_str = '            <div className="space-y-4">\n'
label_str = '                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">\n'
reward_mech_str = '                  Reward Mechanism\n'

start_idx = -1
end_idx = -1

for i in range(len(lines)):
    if start_idx == -1 and "Reward Mechanism" in lines[i] and "Label" in lines[i-1]:
        # found the label, go back 3 lines to find the start
        start_idx = i - 3
        break

if start_idx != -1:
    # Now find the matching closing div
    open_divs = 0
    for i in range(start_idx, len(lines)):
        if "<div" in lines[i]:
            open_divs += lines[i].count("<div")
        if "</div" in lines[i]:
            open_divs -= lines[i].count("</div")
        
        if open_divs == 0:
            end_idx = i
            break

print(f"Start index: {start_idx}, End index: {end_idx}")

if start_idx != -1 and end_idx != -1:
    chunk = lines[start_idx:end_idx+1]
    
    # Remove the chunk from lines
    del lines[start_idx:end_idx+1]
    
    # Find the target location: Delivery & Supply section
    # Search for "Supply Chain Type"
    target_idx = -1
    for i in range(len(lines)):
        if "Supply Chain Type" in lines[i]:
            # go up to the wrapping flex div
            for j in range(i, i-10, -1):
                if '<div className="flex items-center justify-between">' in lines[j]:
                    target_idx = j
                    break
            break
            
    print(f"Target index: {target_idx}")
    
    if target_idx != -1:
        # Insert chunk at target index
        lines = lines[:target_idx] + chunk + lines[target_idx:]
        
        with open("components/rewards/coupons/form/reward-form-sections.tsx", "w") as f:
            f.writelines(lines)
        print("Successfully moved the chunk.")
    else:
        print("Failed to find target index.")
else:
    print("Failed to find chunk start or end.")

