import sys

filename = '/Users/pulseplay/thrico/thrico-entity-dashboard/components/rewards/coupons/form/reward-form-sections.tsx'
with open(filename, 'r') as f:
    lines = f.readlines()

def find_block(start_marker, offset_up=0):
    start_idx = -1
    for i, line in enumerate(lines):
        if start_marker in line:
            start_idx = i - offset_up
            break
            
    if start_idx == -1:
        return -1, -1
        
    open_divs = 0
    end_idx = -1
    for i in range(start_idx, len(lines)):
        open_divs += lines[i].count('<div')
        open_divs -= lines[i].count('</div')
        if open_divs == 0:
            end_idx = i
            break
            
    return start_idx, end_idx

# Reward Mechanism block
rm_start, rm_end = find_block("Reward Mechanism", 2)
# Coupon Type block
ct_start, ct_end = find_block("Coupon Type", 3)

print(f"RM block: {rm_start} to {rm_end}")
print(f"CT block: {ct_start} to {ct_end}")

if rm_start != -1 and ct_start != -1 and rm_start < ct_start:
    rm_chunk = lines[rm_start:rm_end+1]
    ct_chunk = lines[ct_start:ct_end+1]
    
    # We swap them. Since RM is before CT:
    # Everything before RM + CT + RM + Everything after CT
    
    # Wait, there could be an empty line between them.
    # Let's just slice strictly.
    before = lines[:rm_start]
    between = lines[rm_end+1:ct_start]
    after = lines[ct_end+1:]
    
    new_lines = before + ct_chunk + between + rm_chunk + after
    
    with open(filename, 'w') as f:
        f.writelines(new_lines)
    print("Swapped successfully")
else:
    print("Could not swap properly")

