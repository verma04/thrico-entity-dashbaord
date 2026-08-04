const fs = require('fs');
const path = require('path');

const files = [
  // Engagement Games
  { path: './app/(authlayout)/(gamification)/engagement-games/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Engagement Games" }]` },
  { path: './app/(authlayout)/(gamification)/engagement-games/scratch-card/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Engagement Games", href: "/engagement-games" }, { label: "Scratch Card" }]` },
  { path: './app/(authlayout)/(gamification)/engagement-games/match-win/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Engagement Games", href: "/engagement-games" }, { label: "Match & Win" }]` },
  { path: './app/(authlayout)/(gamification)/engagement-games/spin-wheel/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Engagement Games", href: "/engagement-games" }, { label: "Spin Wheel" }]` },
];

for (const file of files) {
  const fullPath = path.resolve(file.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/breadcrumbs=\{\[[\s\S]*?\]\}/g, '');
    const match = content.match(/<EcosystemHeader([^>]*?)\/?>/);
    if (match) {
        const headerText = match[0];
        const cleanedHeader = headerText.replace(/\s+\/>$/, '\n        breadcrumbs={' + file.crumbs + '}\n      />');
        content = content.replace(/<EcosystemHeader[^>]*?\/?>/, (matchStr) => {
            if (matchStr.endsWith('/>')) {
                return matchStr.replace(/\s*\/>$/, '\n        breadcrumbs={' + file.crumbs + '}\n      />');
            } else if (matchStr.endsWith('>')) {
                return matchStr.replace(/\s*>$/, '\n        breadcrumbs={' + file.crumbs + '}\n      >');
            }
            return matchStr;
        });
        content = content.replace(/\n\s*\n\s*breadcrumbs=/g, '\n        breadcrumbs=');
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file.path}`);
    } else {
        console.log(`No EcosystemHeader found in ${file.path}`);
    }
  } else {
    console.log(`File not found: ${file.path}`);
  }
}
