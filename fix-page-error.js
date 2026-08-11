const fs = require('fs');
const file = 'app/(authlayout)/members/create/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Strip GraphQL prefix
content = content.replace(/serverError=\{error\?\.message\}/, 'serverError={error?.message?.replace("GraphQL error: ", "")}');

fs.writeFileSync(file, content);
console.log('Modified page.tsx');
