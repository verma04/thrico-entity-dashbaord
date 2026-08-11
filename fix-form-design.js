const fs = require('fs');
const file = 'components/members/add/member-creation-form.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace card classes
content = content.replace(/ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-card/g, 'ring-1 ring-border/50 overflow-hidden');

// Replace Input/Select custom classes
content = content.replace(/className="([^"]*)h-11 rounded-xl border-border focus:ring-4 focus:ring-indigo-500\/5 transition-all([^"]*)"/g, 'className="$1$2"');
content = content.replace(/className="([^"]*)h-11 pl-10 rounded-xl border-border focus:ring-4 focus:ring-indigo-500\/5 transition-all([^"]*)"/g, 'className="$1pl-10$2"');
content = content.replace(/className="w-full h-11 rounded-xl border-border focus:ring-4 focus:ring-indigo-500\/5 transition-all"/g, 'className="w-full"');

// Fix empty classNames
content = content.replace(/className="(\s+)"/g, '');

// Clean up PopoverTrigger Button
content = content.replace(/className="w-full justify-between h-auto min-h-\[44px\] rounded-xl border-border hover:bg-muted\/50 transition-all px-3 py-2 text-left font-normal"/g, 'className="w-full justify-between font-normal"');

// Clean up badges
content = content.replace(/bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 py-0\.5 px-2 rounded-lg text-\[11px\] font-bold/g, '');

// Clean up card headers
content = content.replace(/bg-muted\/30 border-b border-border pb-4/g, 'bg-muted/30 pb-4');
content = content.replace(/text-indigo-600/g, 'text-primary');

// Clean up Date of Birth button
content = content.replace(/className=\{cn\([\s]*"w-full h-11 justify-start text-left font-normal rounded-xl border-border hover:bg-muted\/50 transition-all",/g, 'className={cn(\n                                  "w-full justify-start text-left font-normal",');

// Clean up PopoverContent
content = content.replace(/className="w-auto p-0 rounded-2xl shadow-xl border-border"/g, 'className="w-auto p-0"');
content = content.replace(/className="w-\[var\(--radix-popover-trigger-width\)\] p-0 rounded-2xl shadow-xl border-border overflow-hidden"/g, 'className="w-[var(--radix-popover-trigger-width)] p-0"');

// Clean up CommandItem selection styles
content = content.replace(/className="flex items-center justify-between py-2\.5 px-3 cursor-pointer hover:bg-muted\/50 transition-colors"/g, 'className="flex items-center justify-between cursor-pointer"');
content = content.replace(/bg-indigo-600 border-indigo-600/g, 'bg-primary border-primary');

// Clean up form inputs that have no className left
content = content.replace(/className=""\n/g, '');

fs.writeFileSync(file, content);
console.log('Replacements complete');
