const puppeteer = require('./node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const testTimes = [
  { name: 'scene1_settled', timeMs: 1500 },
  { name: 'trans_1_to_2', timeMs: 2800 },
  { name: 'scene2_settled', timeMs: 5500 },
  { name: 'trans_2_to_3', timeMs: 7200 },
  { name: 'scene3_settled', timeMs: 10000 },
  { name: 'trans_3_to_4', timeMs: 11800 },
  { name: 'scene4_settled', timeMs: 14500 },
  { name: 'scene5_settled', timeMs: 18000 },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  const htmlPath = 'file://' + path.resolve(__dirname, 'template.html');
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // Wait for webfonts to load
  await page.evaluateHandle('document.fonts.ready');

  const stillsDir = path.resolve(__dirname, 'test_stills');
  if (!fs.existsSync(stillsDir)) {
    fs.mkdirSync(stillsDir, { recursive: true });
  }

  for (const item of testTimes) {
    await page.evaluate((ms) => {
      window.setFrame(ms);
    }, item.timeMs);

    const outPath = path.join(stillsDir, `${item.name}.png`);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`Saved ${item.name} at ${item.timeMs}ms -> ${outPath}`);
  }

  await browser.close();
  console.log('All test stills rendered successfully!');
})();
