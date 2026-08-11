const fs = require('fs');
const file = 'components/members/add/member-creation-form.tsx';
let content = fs.readFileSync(file, 'utf8');

// Clean up Textarea
content = content.replace(/className="min-h-\[120px\] rounded-xl border-border focus:ring-4 focus:ring-indigo-500\/5 transition-all resize-none"/g, 'className="min-h-[120px] resize-none"');

// Clean up Sidebar Card
content = content.replace(/ring-1 ring-slate-200 rounded-3xl/g, 'ring-1 ring-border/50');
content = content.replace(/rounded-3xl/g, '');

// Clean up Card content where ring-slate-200 was missed
content = content.replace(/ring-1 ring-slate-200/g, 'ring-1 ring-border/50');

// Clean up image upload bg
content = content.replace(/rounded-2xl bg-muted/g, 'bg-muted');

// Fix empty classNames
content = content.replace(/className="(\s+)"/g, '');

fs.writeFileSync(file, content);
console.log('Replacements complete');
