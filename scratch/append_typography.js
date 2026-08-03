const fs = require('fs');

const data = {
    "p": [
        "14px / weight:500 / lh:16.002px"
    ],
    "a": [
        "13px / weight:400 / lh:13px",
        "16px / weight:500 / lh:18.2857px",
        "14px / weight:400 / lh:14px",
        "14px / weight:400 / lh:28px",
        "14px / weight:400 / lh:16.002px",
        "0px / weight:400 / lh:0px"
    ],
    "button": [
        "13.3333px / weight:400 / lh:normal",
        "14px / weight:400 / lh:normal",
        "16px / weight:500 / lh:21.3333px",
        "18px / weight:400 / lh:normal",
        "14px / weight:500 / lh:16px",
        "20px / weight:400 / lh:normal",
        "16px / weight:500 / lh:18.2857px",
        "12px / weight:500 / lh:16.008px",
        "14px / weight:600 / lh:16.002px",
        "12px / weight:500 / lh:16px",
        "12px / weight:600 / lh:16.008px",
        "14px / weight:400 / lh:18.676px"
    ],
    "span": [
        "11px / weight:700 / lh:normal",
        "14px / weight:600 / lh:16.002px",
        "14px / weight:500 / lh:16px",
        "14px / weight:400 / lh:16px",
        "12px / weight:700 / lh:12px",
        "13px / weight:400 / lh:13px",
        "10px / weight:700 / lh:16px",
        "10px / weight:600 / lh:16px",
        "16px / weight:600 / lh:20px",
        "16px / weight:500 / lh:18.2857px",
        "14px / weight:400 / lh:28px",
        "14px / weight:400 / lh:16.002px",
        "16px / weight:500 / lh:21.3333px",
        "12px / weight:400 / lh:28px",
        "14px / weight:400 / lh:14px",
        "10px / weight:700 / lh:10px",
        "8px / weight:700 / lh:9.144px",
        "12px / weight:600 / lh:16.008px",
        "12px / weight:500 / lh:16.008px",
        "12px / weight:700 / lh:normal",
        "12px / weight:500 / lh:16px",
        "0px / weight:400 / lh:0px",
        "14px / weight:500 / lh:21px",
        "12px / weight:400 / lh:22px",
        "16px / weight:500 / lh:20px"
    ],
    "input": [
        "14px / weight:400 / lh:16px",
        "14px / weight:400 / lh:21px",
        "13.3333px / weight:400 / lh:normal"
    ]
};

let cssAppends = "\n/* --- Exact Extracted Variants --- */\n";

for (const [tag, styles] of Object.entries(data)) {
    cssAppends += `\n/* ${tag.toUpperCase()} Specific Extracted Variants */\n`;
    styles.forEach((styleStr, index) => {
        // e.g. "14px / weight:500 / lh:16.002px"
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
console.log('Appended specific JSON typography variants.');
