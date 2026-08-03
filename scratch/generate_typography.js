const fs = require('fs');

const css = `
/* 
  Auth Layout Typography Theme (ClickUp Reference) 
  Default element styles (responsive)
*/
.auth-typography-theme h1, .auth-typography-theme .h1 { font-size: 38px; font-weight: 650; line-height: 44px; }
.auth-typography-theme h2, .auth-typography-theme .h2 { font-size: 34px; font-weight: 650; line-height: 40.8px; }
.auth-typography-theme h3, .auth-typography-theme .h3 { font-size: 26px; font-weight: 650; line-height: 32.5px; }
.auth-typography-theme h4, .auth-typography-theme .h4 { font-size: 14px; font-weight: 600; line-height: 21px; }
.auth-typography-theme p, .auth-typography-theme .body-text { font-size: 16px; font-weight: 400; line-height: 24px; }
.auth-typography-theme a { font-size: 14px; font-weight: 500; line-height: 21px; }
.auth-typography-theme button, .auth-typography-theme .btn { font-size: 14px; font-weight: 600; line-height: 16px; }
.auth-typography-theme nav { font-size: 16px; font-weight: 400; line-height: 24px; }
.auth-typography-theme li { font-size: 16px; font-weight: 400; line-height: 24px; }
.auth-typography-theme label { font-size: 16px; font-weight: 500; }
.auth-typography-theme input { font-size: 16px; font-weight: 400; line-height: 24px; }

@media (min-width: 768px) {
  .auth-typography-theme h1, .auth-typography-theme .h1 { font-size: 52px; font-weight: 700; line-height: 57.2px; }
  .auth-typography-theme h2, .auth-typography-theme .h2 { font-size: 48px; font-weight: 650; line-height: 60px; }
  .auth-typography-theme h3, .auth-typography-theme .h3 { font-size: 40px; font-weight: 650; line-height: 47.06px; }
  .auth-typography-theme h4, .auth-typography-theme .h4 { font-size: 16px; font-weight: 500; line-height: 20px; }
}

@media (min-width: 1024px) {
  .auth-typography-theme h1, .auth-typography-theme .h1 { font-size: 60px; font-weight: 700; line-height: 66px; }
  .auth-typography-theme h2, .auth-typography-theme .h2 { font-size: 60px; font-weight: 700; line-height: 66px; }
  .auth-typography-theme h3, .auth-typography-theme .h3 { font-size: 56px; font-weight: 700; line-height: 64.4px; }
}

/* =========================================
   Utility Classes for ALL Variant Sizes
   ========================================= */

/* --- H1 Variants --- */
.auth-typography-theme .text-h1-60 { font-size: 60px; font-weight: 700; line-height: 66px; }
.auth-typography-theme .text-h1-52 { font-size: 52px; font-weight: 700; line-height: 57.2px; }
.auth-typography-theme .text-h1-38 { font-size: 38px; font-weight: 650; line-height: 44px; }

/* --- H2 Variants --- */
.auth-typography-theme .text-h2-80 { font-size: 80px; font-weight: 700; line-height: 96px; }
.auth-typography-theme .text-h2-76 { font-size: 76px; font-weight: 700; line-height: 79.8px; }
.auth-typography-theme .text-h2-60 { font-size: 60px; font-weight: 700; line-height: 66px; }
.auth-typography-theme .text-h2-48 { font-size: 48px; font-weight: 650; line-height: 60px; }
.auth-typography-theme .text-h2-40 { font-size: 40px; font-weight: 650; line-height: 48px; }
.auth-typography-theme .text-h2-34 { font-size: 34px; font-weight: 650; line-height: 40.8px; }
.auth-typography-theme .text-h2-16 { font-size: 16px; font-weight: 700; line-height: 24px; }

/* --- H3 Variants --- */
.auth-typography-theme .text-h3-56 { font-size: 56px; font-weight: 700; line-height: 64.4px; }
.auth-typography-theme .text-h3-44 { font-size: 44px; font-weight: 650; line-height: 48.4px; }
.auth-typography-theme .text-h3-40 { font-size: 40px; font-weight: 650; line-height: 47.06px; }
.auth-typography-theme .text-h3-26 { font-size: 26px; font-weight: 650; line-height: 32.5px; }
.auth-typography-theme .text-h3-16 { font-size: 16px; font-weight: 700; line-height: 20.8px; }

/* --- H4 Variants --- */
.auth-typography-theme .text-h4-16 { font-size: 16px; font-weight: 500; line-height: 20px; }
.auth-typography-theme .text-h4-14-bold { font-size: 14px; font-weight: 700; line-height: 21px; }
.auth-typography-theme .text-h4-14-semi { font-size: 14px; font-weight: 600; line-height: 21px; }

/* --- Paragraph Variants --- */
.auth-typography-theme .text-p-20 { font-size: 20px; font-weight: 400; line-height: 30px; }
.auth-typography-theme .text-p-19 { font-size: 19px; font-weight: 500; line-height: 26px; }
.auth-typography-theme .text-p-18 { font-size: 18px; font-weight: 500; line-height: 24px; }
.auth-typography-theme .text-p-18-regular { font-size: 18px; font-weight: 400; line-height: 24px; }
.auth-typography-theme .text-p-18-semi { font-size: 18px; font-weight: 600; line-height: 24px; }
.auth-typography-theme .text-p-17 { font-size: 17px; font-weight: 400; line-height: 26px; }
.auth-typography-theme .text-p-16-medium { font-size: 16px; font-weight: 500; line-height: 20px; }
.auth-typography-theme .text-p-16-regular { font-size: 16px; font-weight: 400; line-height: 24px; }
.auth-typography-theme .text-p-16-normal { font-size: 16px; font-weight: 400; line-height: normal; }
.auth-typography-theme .text-p-15 { font-size: 15px; font-weight: 500; line-height: 22px; }
.auth-typography-theme .text-p-14-regular { font-size: 14px; font-weight: 400; line-height: 20px; }
.auth-typography-theme .text-p-14-medium { font-size: 14px; font-weight: 500; line-height: 20px; }
.auth-typography-theme .text-p-14-tight { font-size: 14px; font-weight: 500; line-height: 18px; }
.auth-typography-theme .text-p-13 { font-size: 12.99px; font-weight: 400; line-height: 19.49px; }
.auth-typography-theme .text-p-12-regular { font-size: 12px; font-weight: 400; line-height: 18px; }
.auth-typography-theme .text-p-12-medium { font-size: 12px; font-weight: 500; line-height: 18px; }
.auth-typography-theme .text-p-12-tight { font-size: 12px; font-weight: 500; line-height: 16px; }

/* --- Link Variants --- */
.auth-typography-theme .text-link-16 { font-size: 16px; font-weight: 500; line-height: 21.33px; }
.auth-typography-theme .text-link-16-regular { font-size: 16px; font-weight: 400; line-height: 24px; }
.auth-typography-theme .text-link-16-semi { font-size: 16px; font-weight: 600; line-height: 22px; }
.auth-typography-theme .text-link-14 { font-size: 14px; font-weight: 500; line-height: 21px; }
.auth-typography-theme .text-link-13 { font-size: 12.99px; font-weight: 400; line-height: 19.49px; }
.auth-typography-theme .text-link-12 { font-size: 12px; font-weight: 500; line-height: 18px; }

/* --- Button Variants --- */
.auth-typography-theme .text-btn-18-bold { font-size: 18px; font-weight: 700; line-height: 24px; }
.auth-typography-theme .text-btn-18-semi { font-size: 18px; font-weight: 650; line-height: 24px; }
.auth-typography-theme .text-btn-16 { font-size: 16px; font-weight: 500; line-height: 24px; }
.auth-typography-theme .text-btn-14-bold { font-size: 14.4px; font-weight: 700; line-height: 14.4px; }
.auth-typography-theme .text-btn-14 { font-size: 14px; font-weight: 600; line-height: 21px; }
.auth-typography-theme .text-btn-12 { font-size: 12px; font-weight: 700; line-height: 12px; }

/* --- Span / Utility Text Variants --- */
.auth-typography-theme .text-span-76 { font-size: 76px; font-weight: 700; line-height: 79.8px; }
.auth-typography-theme .text-span-60 { font-size: 60px; font-weight: 700; line-height: 66px; }
.auth-typography-theme .text-span-52 { font-size: 52px; font-weight: 700; line-height: 57.2px; }
.auth-typography-theme .text-span-40 { font-size: 40px; font-weight: 650; line-height: 50px; }
.auth-typography-theme .text-span-34 { font-size: 34px; font-weight: 650; line-height: 40.8px; }
.auth-typography-theme .text-span-24 { font-size: 24px; font-weight: 500; line-height: 21.6px; }
.auth-typography-theme .text-span-18-bold { font-size: 18px; font-weight: 700; line-height: 24px; }
.auth-typography-theme .text-span-16 { font-size: 16px; font-weight: 400; line-height: 24px; }
.auth-typography-theme .text-span-14 { font-size: 14px; font-weight: 500; line-height: 22px; }
.auth-typography-theme .text-span-13 { font-size: 13.6px; font-weight: 400; line-height: normal; }
.auth-typography-theme .text-span-12-medium { font-size: 12px; font-weight: 500; line-height: 20px; }
.auth-typography-theme .text-span-10-medium { font-size: 10.5px; font-weight: 500; line-height: 15.75px; }
.auth-typography-theme .text-span-10-regular { font-size: 10px; font-weight: 400; line-height: 20px; }
.auth-typography-theme .text-span-9 { font-size: 9.21px; font-weight: 500; line-height: 13.81px; }

/* --- Other Variants --- */
.auth-typography-theme .text-label-16 { font-size: 16px; font-weight: 600; line-height: normal; }
.auth-typography-theme .text-input-16 { font-size: 16px; font-weight: 400; line-height: 24px; }
.auth-typography-theme .text-input-13 { font-size: 12.8px; font-weight: 400; line-height: normal; }
`;

fs.writeFileSync('./app/(authlayout)/auth-typography.css', css, 'utf8');
console.log('CSS updated');
