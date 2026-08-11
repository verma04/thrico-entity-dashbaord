const fs = require('fs');
const file = 'components/members/add/member-creation-form.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the block for Headline and About
const headlineAboutRegex = /\s*\{\/\* Headline \*\/\}\s*<div className="space-y-2">\s*<Label\s*htmlFor="headline"[\s\S]*?<\/div>\s*\{\/\* About \/ Bio \*\/\}\s*<div className="space-y-2">\s*<Label\s*htmlFor="about"[\s\S]*?<\/div>\s*/;

const match = content.match(headlineAboutRegex);
if (match) {
  const block = match[0];
  content = content.replace(headlineAboutRegex, '\n');
  
  // Find the end of Personal Information CardContent
  const personalInfoEndRegex = /(\{\/\* Date of Birth \*\/\}(?:.|\n)*?<\/div>\s*<\/div>\s*)<\/CardContent>/;
  content = content.replace(personalInfoEndRegex, `$1${block}</CardContent>`);
  
  fs.writeFileSync(file, content);
  console.log('Moved successfully');
} else {
  console.log('Could not find Headline/About block');
}
