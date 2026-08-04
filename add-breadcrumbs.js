const fs = require('fs');
const path = require('path');

const files = [
  // Engagement Games
  { path: './app/(authlayout)/engagement-games/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Engagement Games" }]` },
  { path: './app/(authlayout)/engagement-games/scratch-card/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Engagement Games", href: "/engagement-games" }, { label: "Scratch Card" }]` },
  { path: './app/(authlayout)/engagement-games/match-win/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Engagement Games", href: "/engagement-games" }, { label: "Match & Win" }]` },
  { path: './app/(authlayout)/engagement-games/spin-wheel/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Engagement Games", href: "/engagement-games" }, { label: "Spin Wheel" }]` },

  // Currency
  { path: './app/(authlayout)/currency/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Currency" }]` },
  { path: './app/(authlayout)/currency/trace/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Currency", href: "/currency" }, { label: "Transaction Trace" }]` },
  { path: './app/(authlayout)/currency/audit-log/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Currency", href: "/currency" }, { label: "Audit Log" }]` },
  { path: './app/(authlayout)/currency/economics/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Currency", href: "/currency" }, { label: "Economics" }]` },
  { path: './app/(authlayout)/currency/risk/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Currency", href: "/currency" }, { label: "Risk & Fraud" }]` },
  { path: './app/(authlayout)/currency/redemption/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Currency", href: "/currency" }, { label: "Redemption" }]` },

  // Rewards
  { path: './app/(authlayout)/rewards/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Rewards" }]` },
  { path: './app/(authlayout)/rewards/redemptions/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Rewards", href: "/rewards" }, { label: "Redemptions" }]` },
  { path: './app/(authlayout)/rewards/fraud/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Rewards", href: "/rewards" }, { label: "Fraud Protection" }]` },
  { path: './app/(authlayout)/rewards/analytics/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Rewards", href: "/rewards" }, { label: "Analytics" }]` },
  { path: './app/(authlayout)/rewards/coupons/layout.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Rewards", href: "/rewards" }, { label: "Coupons" }]` },

  // Impact Score
  { path: './app/(authlayout)/impact-score/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score" }]` },
  { path: './app/(authlayout)/impact-score/settings/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/impact-score" }, { label: "Settings" }]` },
  { path: './app/(authlayout)/impact-score/documentation/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/impact-score" }, { label: "Documentation" }]` },
  { path: './app/(authlayout)/impact-score/audit-log/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/impact-score" }, { label: "Audit Log" }]` },
  { path: './app/(authlayout)/impact-score/activity-log/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/impact-score" }, { label: "Activity Log" }]` },
  { path: './app/(authlayout)/impact-score/rules/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/impact-score" }, { label: "Rules" }]` },
  { path: './app/(authlayout)/impact-score/rules/create/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/impact-score" }, { label: "Rules", href: "/impact-score/rules" }, { label: "Create" }]` },
  { path: './app/(authlayout)/impact-score/rules/[id]/edit/page.tsx', crumbs: `[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/impact-score" }, { label: "Rules", href: "/impact-score/rules" }, { label: "Edit" }]` },
];

for (const file of files) {
  const fullPath = path.resolve(file.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Remove existing breadcrumbs if any
    content = content.replace(/breadcrumbs=\{\[[\s\S]*?\]\}/g, '');

    // Now insert the new breadcrumbs prop before the closing /> or >
    // EcosystemHeader can be <EcosystemHeader ... /> or <EcosystemHeader ... >
    
    // We'll look for `<EcosystemHeader` and its attributes
    const match = content.match(/<EcosystemHeader([^>]*?)\/?>/);
    if (match) {
        const headerText = match[0];
        // Ensure there are no leftover trailing empty lines before /> from the replace
        const cleanedHeader = headerText.replace(/\s+\/>$/, '\n        breadcrumbs={' + file.crumbs + '}\n      />');
        const newHeader = cleanedHeader.includes('breadcrumbs={') ? cleanedHeader : headerText.replace(/\s+\/>$/, '\n        breadcrumbs={' + file.crumbs + '}\n      />');
        
        // Let's use a safer replace logic since some headers might end with > and have children
        content = content.replace(/<EcosystemHeader[^>]*?\/?>/, (matchStr) => {
            if (matchStr.endsWith('/>')) {
                return matchStr.replace(/\s*\/>$/, '\n        breadcrumbs={' + file.crumbs + '}\n      />');
            } else if (matchStr.endsWith('>')) {
                return matchStr.replace(/\s*>$/, '\n        breadcrumbs={' + file.crumbs + '}\n      >');
            }
            return matchStr;
        });

        // Cleanup empty lines
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
