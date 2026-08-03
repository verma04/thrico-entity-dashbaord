const fs = require('fs');

const data = {
    "h1": [
        "20px / weight:600 / lh:26.68px"
    ],
    "h2": [
        "14px / weight:500 / lh:16.002px",
        "12px / weight:500 / lh:16.008px"
    ],
    "h3": [
        "12px / weight:500 / lh:17.4px",
        "14px / weight:500 / lh:16.002px",
        "12px / weight:500 / lh:16.008px"
    ],
    "h4": [
        "12px / weight:500 / lh:16.008px"
    ],
    "p": [
        "12px / weight:400 / lh:18px",
        "12px / weight:400 / lh:16.008px",
        "14px / weight:400 / lh:16.002px"
    ],
    "a": [
        "13px / weight:400 / lh:13px",
        "14px / weight:400 / lh:16px",
        "14px / weight:500 / lh:16px",
        "12px / weight:400 / lh:16.008px",
        "12px / weight:400 / lh:18px"
    ],
    "button": [
        "13.3333px / weight:400 / lh:normal",
        "14px / weight:400 / lh:normal",
        "16px / weight:500 / lh:21.3333px",
        "18px / weight:400 / lh:normal",
        "14px / weight:500 / lh:16px",
        "20px / weight:400 / lh:normal",
        "14px / weight:400 / lh:16px",
        "14px / weight:400 / lh:20px",
        "12px / weight:400 / lh:normal"
    ],
    "nav": [
        "13px / weight:400 / lh:13px"
    ],
    "li": [
        "13px / weight:400 / lh:13px"
    ],
    "span": [
        "11px / weight:700 / lh:normal",
        "14px / weight:600 / lh:16.002px",
        "14px / weight:500 / lh:16px",
        "14px / weight:400 / lh:16px",
        "12px / weight:700 / lh:12px",
        "13px / weight:400 / lh:13px",
        "10px / weight:600 / lh:16px",
        "14px / weight:500 / lh:16.002px",
        "12px / weight:500 / lh:12px",
        "14px / weight:400 / lh:16.002px",
        "14px / weight:400 / lh:20px",
        "12px / weight:500 / lh:13.716px",
        "12px / weight:400 / lh:16.008px",
        "12px / weight:500 / lh:16.008px",
        "11px / weight:600 / lh:14.674px",
        "10px / weight:700 / lh:10px"
    ],
    "label": [
        "12px / weight:500 / lh:16.008px",
        "13px / weight:400 / lh:13px",
        "14px / weight:400 / lh:20px",
        "14px / weight:400 / lh:21px"
    ],
    "input": [
        "14px / weight:400 / lh:17.5px",
        "13.3333px / weight:400 / lh:normal",
        "14px / weight:400 / lh:21px"
    ]
};

let cssAppends = "\n/* --- Secondary Extracted Variants --- */\n";

for (const [tag, styles] of Object.entries(data)) {
    cssAppends += `\n/* ${tag.toUpperCase()} Specific Variants - Round 2 */\n`;
    styles.forEach((styleStr, index) => {
        const parts = styleStr.split(' / ');
        const fontSizeStr = parts[0].trim();
        const weightStr = parts[1].replace('weight:', '').trim();
        const lhStr = parts[2].replace('lh:', '').trim();

        // Create a safe class name
        const cleanSize = fontSizeStr.replace('px', '').replace('.', '_');
        const cleanLh = lhStr.replace('px', '').replace('.', '_');
        
        const className = `.text-${tag}-${cleanSize}-w${weightStr}-lh${cleanLh}`;
        
        cssAppends += `.auth-typography-theme ${className} { font-size: ${fontSizeStr}; font-weight: ${weightStr}; line-height: ${lhStr}; }\n`;
    });
}

const cssPath = './app/(authlayout)/auth-typography.css';
const existingCss = fs.readFileSync(cssPath, 'utf8');
fs.writeFileSync(cssPath, existingCss + cssAppends, 'utf8');
console.log('Appended specific JSON typography variants round 2.');
