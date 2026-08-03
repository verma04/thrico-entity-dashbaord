const fs = require('fs');

const layoutPath = './app/layout.tsx';
const webLayoutPath = './app/(authlayout)/app-layout/(webiste-layout)/layout.tsx';

let layoutContent = fs.readFileSync(layoutPath, 'utf8');
let webLayoutContent = fs.readFileSync(webLayoutPath, 'utf8');

// 1. Extract the font imports from layout.tsx
const importMatch = layoutContent.match(/import localFont from "next\/font\/local";[\s\S]*?from "next\/font\/google";/);
if (!importMatch) throw new Error("Could not find font imports");
const fontImports = importMatch[0];

// 2. Extract the local font definitions
const roobertMatch = layoutContent.match(/const roobert = localFont\({[\s\S]*?variable: "--font-roobert",\n}\);/);
const avantGardeMatch = layoutContent.match(/const avantGarde = localFont\({[\s\S]*?variable: "--font-avant-garde",\n}\);/);

// 3. Extract all google font definitions
const googleFontsMatch = layoutContent.match(/const figtree = Figtree\({[\s\S]*?const plusJakartaSans = Plus_Jakarta_Sans\({[\s\S]*?}\);/);

if (!roobertMatch || !avantGardeMatch || !googleFontsMatch) throw new Error("Could not find font definitions");

let roobertStr = roobertMatch[0].replace(/\.\.\/public\/font\//g, '../../../../public/font/');
let avantGardeStr = avantGardeMatch[0].replace(/\.\.\/public\/font\//g, '../../../../public/font/');
let allFontDefs = roobertStr + '\n\n' + avantGardeStr + '\n\n' + googleFontsMatch[0];

// 4. Extract the class name string
const bodyClassMatch = layoutContent.match(/className={`([^`]+)`}/);
if (!bodyClassMatch) throw new Error("Could not find body class");
const classNames = bodyClassMatch[1];
const fontClassNames = classNames.replace(' font-sans antialiased', '');

// 5. Remove everything from layout.tsx
layoutContent = layoutContent.replace(importMatch[0] + '\n', '');
layoutContent = layoutContent.replace(roobertMatch[0] + '\n\n', '');
layoutContent = layoutContent.replace(avantGardeMatch[0] + '\n\n', '');
layoutContent = layoutContent.replace(googleFontsMatch[0] + '\n\n', '');

// Wait, the body class has variables that will be undefined now.
layoutContent = layoutContent.replace(/className={`[^`]+`}/, 'className="font-sans antialiased"');

// 6. Insert into webLayoutPath
// Insert imports after `import * as React from "react";`
webLayoutContent = webLayoutContent.replace('import * as React from "react";\n', 'import * as React from "react";\n\n' + fontImports + '\n\n' + allFontDefs + '\n');

// Wrap the return with a div containing the class names
webLayoutContent = webLayoutContent.replace(
  /<>\n\s*<PlanDrawer \/>/g,
  `<div className={\`${fontClassNames}\`}>\n      <PlanDrawer />`
);
webLayoutContent = webLayoutContent.replace(
  /<\/MenuItemsLayout>\n\s*<\/>/g,
  `<\/MenuItemsLayout>\n    </div>`
);

fs.writeFileSync(layoutPath, layoutContent);
fs.writeFileSync(webLayoutPath, webLayoutContent);
console.log("Fonts moved successfully");
