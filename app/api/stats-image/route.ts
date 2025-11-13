import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
	let browser;

	try {
		console.log("🚀 Launching browser for screenshot...");

		// Determine if we're in production (Vercel) or local development
		const isProduction = process.env.NODE_ENV === "production";

		if (isProduction) {
			// Use serverless Chromium on Vercel
			browser = await puppeteer.launch({
				args: chromium.args,
				executablePath: await chromium.executablePath(),
				headless: true,
			});
		} else {
			// Use local Chromium in development
			// You'll need to install Chrome locally: npx puppeteer browsers install chrome
			const puppeteerLocal = await import("puppeteer");
			browser = await puppeteerLocal.default.launch({
				headless: true,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-accelerated-2d-canvas",
					"--disable-gpu",
				],
			});
		}

		const page = await browser.newPage();

		// Set viewport to match GitHub profile README dimensions
		await page.setViewport({
			width: 1280,
			height: 640,
			deviceScaleFactor: 2,
		});

		// Get the host from the request
		const host = request.headers.get("host") || "localhost:3000";
		const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
		const url = `${protocol}://${host}`;

		console.log(`📡 Navigating to ${url}...`);

		await page.goto(url, {
			waitUntil: "networkidle0",
			timeout: 30000,
		});

		console.log("⏳ Waiting for content to load...");

		// Wait for the main content
		await page.waitForSelector(".max-w-4xl", { timeout: 10000 });

		// Wait for animations
		await new Promise((resolve) => setTimeout(resolve, 2000));

		console.log("📸 Taking screenshot...");

		// Take screenshot of the main element
		const element = await page.$(".max-w-4xl");
		let screenshot: Buffer;

		if (element) {
			screenshot = (await element.screenshot({
				type: "png",
			})) as Buffer;
		} else {
			screenshot = (await page.screenshot({
				fullPage: true,
				type: "png",
			})) as Buffer;
		}

		console.log("✅ Screenshot generated successfully");

		// Return the image with appropriate headers
		return new NextResponse(new Uint8Array(screenshot), {
			status: 200,
			headers: {
				"Content-Type": "image/png",
				"Cache-Control":
					"public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
				"CDN-Cache-Control": "public, max-age=3600",
				"Vercel-CDN-Cache-Control": "public, max-age=3600",
			},
		});
	} catch (error) {
		console.error("❌ Error generating screenshot:", error);

		return NextResponse.json(
			{
				error: "Failed to generate screenshot",
				message: (error as Error).message,
			},
			{ status: 500 }
		);
	} finally {
		if (browser) {
			await browser.close();
			console.log("🔒 Browser closed");
		}
	}
}
