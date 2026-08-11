const fs = require('fs');
const file = 'components/members/add/member-creation-form.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Alert import
if (!content.includes('import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";')) {
  content = content.replace(/import { Badge } from "@\/components\/ui\/badge";/, 'import { Badge } from "@/components/ui/badge";\nimport { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";\nimport { AlertCircle } from "lucide-react";');
}

// Update props
content = content.replace(/isEdit = false,\n\}: any\) \{/, 'isEdit = false,\n  serverError,\n}: any) {');

// Render Alert if serverError exists
const alertHtml = `
                {serverError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}
`;

content = content.replace(/<form onSubmit=\{handleSubmit\} className="space-y-8">/, '<form onSubmit={handleSubmit} className="space-y-8">\n' + alertHtml);

fs.writeFileSync(file, content);
console.log('Modified form.tsx');
