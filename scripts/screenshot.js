const puppeteer = require('puppeteer');
const path = require('path');

async function captureScreenshot() {
  console.log('🚀 Launching browser...');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();

    // Set viewport to match GitHub profile README dimensions (wider aspect ratio)
    await page.setViewport({
      width: 1280,
      height: 640,
      deviceScaleFactor: 2 // For higher quality/retina display
    });

    console.log('📡 Navigating to localhost:3000...');

    // Navigate to the local development server
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle0', // Wait until network is idle
      timeout: 30000
    });

    console.log('⏳ Waiting for content to load...');

    // Wait for the main content to be visible
    await page.waitForSelector('.max-w-4xl', { timeout: 10000 });

    // Optional: Wait a bit more for animations/transitions
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Define output path
    const outputPath = path.join(__dirname, '..', 'github-stats.png');

    console.log('📸 Taking screenshot...');

    // Take screenshot of the main card element
    const element = await page.$('.max-w-4xl');
    if (element) {
      await element.screenshot({
        path: outputPath,
        type: 'png'
      });
      console.log(`✅ Screenshot saved to: ${outputPath}`);
    } else {
      // Fallback: take full page screenshot
      await page.screenshot({
        path: outputPath,
        fullPage: true,
        type: 'png'
      });
      console.log(`✅ Full page screenshot saved to: ${outputPath}`);
    }

  } catch (error) {
    console.error('❌ Error capturing screenshot:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('🔒 Browser closed.');
  }
}

// Run the function
captureScreenshot()
  .then(() => {
    console.log('🎉 Screenshot generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Screenshot generation failed:', error);
    process.exit(1);
  });
