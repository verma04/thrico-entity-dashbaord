import re

with open("/Users/pulseplay/thrico/thrico-entity-dashboard/app/(authlayout)/email/templates/create/page.tsx", "r") as f:
    content = f.read()

# Replace the entire block from the start of STARTER_KEY_MAP down to the end of TemplateChooser with just the imports.
pattern = re.compile(r"// Map our chooser key → actual STARTER_TEMPLATES key.*?// ─── Page entry point ─────────────────────────────────────────────────────────", re.DOTALL)

replacement = """import { TemplateChooser } from "@/components/email/template-chooser/template-chooser";
import { STARTER_KEY_MAP } from "@/components/email/template-chooser/template-data";

// ─── Page entry point ─────────────────────────────────────────────────────────"""

new_content = pattern.sub(replacement, content)

with open("/Users/pulseplay/thrico/thrico-entity-dashboard/app/(authlayout)/email/templates/create/page.tsx", "w") as f:
    f.write(new_content)

