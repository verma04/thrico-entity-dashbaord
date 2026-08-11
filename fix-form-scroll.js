const fs = require('fs');
const file = 'components/members/add/member-creation-form.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace flex-1 overflow-y-auto with just a normal div
content = content.replace(/<div className="flex-1 overflow-y-auto">/, '<div>');

fs.writeFileSync(file, content);
console.log('Replacements complete');
