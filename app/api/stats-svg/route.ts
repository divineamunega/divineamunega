import { NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	try {
		const stats = await fetchGitHubStats("divineamunega");

		// SVG optimized for GitHub README (495px width standard)
		const svg = `
<svg width="495" height="600" viewBox="0 0 495 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
    <style>
      .username { font: bold 16px 'Segoe UI', system-ui, sans-serif; fill: #60a5fa; }
      .section-title { font: bold 13px 'Segoe UI', system-ui, sans-serif; fill: #67e8f9; }
      .label { font: 11px 'Segoe UI', system-ui, sans-serif; fill: #93c5fd; }
      .value { font: 11px 'Segoe UI', system-ui, sans-serif; fill: #ffffff; }
      .stat-card { fill: rgba(6, 182, 212, 0.1); }
      .stat-label { font: 10px 'Segoe UI', system-ui, sans-serif; fill: #67e8f9; }
      .stat-value { font: bold 18px 'Segoe UI', system-ui, sans-serif; fill: #ffffff; }
      .streak-card { fill: rgba(16, 185, 129, 0.1); }
      .streak-label { font: 9px 'Segoe UI', system-ui, sans-serif; fill: #6ee7b7; }
      .lang-badge { font: 9px 'Segoe UI', system-ui, sans-serif; fill: #bfdbfe; }
      .divider { stroke: #3b82f680; stroke-width: 0.5; }
      .footer { font: 8px 'Segoe UI', system-ui, sans-serif; fill: #94a3b8; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="495" height="600" fill="url(#bg)"/>

  <!-- Main Container -->
  <rect x="10" y="10" width="475" height="580" rx="8" fill="#1e293b80" stroke="#3b82f650" stroke-width="1"/>

  <!-- Header -->
  <text x="25" y="35" class="username">${stats.username}@github</text>
  <line x1="25" y1="42" x2="470" y2="42" class="divider"/>

  <!-- Basic Info -->
  <text x="25" y="62" class="label">Name:</text>
  <text x="90" y="62" class="value">${stats.fullName}</text>

  <text x="280" y="62" class="label">Experience:</text>
  <text x="355" y="62" class="value">${stats.experience}</text>

  <text x="25" y="78" class="label">Bio:</text>
  <text x="90" y="78" class="value">${stats.bio.substring(0, 50)}${stats.bio.length > 50 ? '...' : ''}</text>

  <line x1="25" y1="88" x2="470" y2="88" class="divider"/>

  <!-- Commit Activity Section -->
  <text x="25" y="108" class="section-title">📊 Commit Activity</text>

  <!-- Stats Cards Row 1 -->
  <rect x="25" y="120" width="140" height="65" rx="6" class="stat-card" stroke="#06b6d450" stroke-width="0.5"/>
  <text x="35" y="135" class="stat-label">Total Commits</text>
  <text x="35" y="163" class="stat-value">${stats.totalCommits}</text>

  <rect x="177" y="120" width="140" height="65" rx="6" class="stat-card" stroke="#06b6d450" stroke-width="0.5"/>
  <text x="187" y="135" class="stat-label">Total Repos</text>
  <text x="187" y="163" class="stat-value">${stats.totalRepos}</text>

  <rect x="330" y="120" width="140" height="65" rx="6" fill="rgba(234, 179, 8, 0.1)" stroke="#eab30850" stroke-width="0.5"/>
  <text x="340" y="135" class="stat-label">⭐ Total Stars</text>
  <text x="340" y="163" class="stat-value">${stats.totalStars}</text>

  <!-- Streak Cards Row 2 -->
  <rect x="25" y="200" width="217" height="65" rx="6" class="streak-card" stroke="#10b98150" stroke-width="0.5"/>
  <text x="35" y="215" class="streak-label">🔥 Current Streak</text>
  <text x="35" y="243" class="stat-value">${stats.currentStreak}</text>

  <rect x="253" y="200" width="217" height="65" rx="6" class="streak-card" stroke="#10b98150" stroke-width="0.5"/>
  <text x="263" y="215" class="streak-label">📈 Longest Streak</text>
  <text x="263" y="243" class="stat-value">${stats.longestStreak}</text>

  <!-- Activity Patterns -->
  <rect x="25" y="280" width="445" height="85" rx="6" fill="rgba(139, 92, 246, 0.1)" stroke="#8b5cf650" stroke-width="0.5"/>
  <text x="35" y="295" class="streak-label">📅 Activity Patterns</text>

  <text x="35" y="315" class="stat-label">Most Active Day</text>
  <text x="35" y="330" class="value">${stats.mostCommitDay} (${stats.mostCommitDayCount})</text>

  <text x="35" y="347" class="stat-label">Most Active Date</text>
  <text x="35" y="360" class="value">${stats.mostActiveDate.substring(0, 28)}</text>

  <line x1="25" y1="378" x2="470" y2="378" class="divider"/>

  <!-- Notable Projects -->
  <text x="25" y="398" class="section-title">💻 Notable Projects</text>

  <text x="25" y="418" class="label">Most Commits:</text>
  <text x="125" y="418" class="value">${stats.mostCommitProject}</text>

  <text x="25" y="434" class="label">⭐ Favourite:</text>
  <text x="125" y="434" class="value">${stats.favouriteProject} (${stats.favouriteProjectStars} ⭐)</text>

  <line x1="25" y1="447" x2="470" y2="447" class="divider"/>

  <!-- Tech Stack -->
  <text x="25" y="467" class="section-title">🔧 Tech Stack</text>
  ${stats.languages
		.slice(0, 8)
		.map((lang, idx) => {
			const col = idx % 4;
			const row = Math.floor(idx / 4);
			return `
    <rect x="${35 + col * 110}" y="${478 + row * 25}" width="${Math.min(lang.length * 7 + 12, 100)}" height="20" rx="3" fill="#3b82f630" stroke="#60a5fa50" stroke-width="0.5"/>
    <text x="${42 + col * 110}" y="${492 + row * 25}" class="lang-badge">${lang}</text>
  `;
		})
		.join("")}

  <!-- Footer -->
  <text x="247" y="575" class="footer" text-anchor="middle">Last updated: ${new Date().toLocaleDateString()}</text>
</svg>
`.trim();

		return new NextResponse(svg, {
			status: 200,
			headers: {
				"Content-Type": "image/svg+xml",
				"Cache-Control": "no-cache, no-store, must-revalidate",
				"Pragma": "no-cache",
				"Expires": "0",
			},
		});
	} catch (error) {
		console.error("Error generating SVG stats:", error);

		// Return error SVG
		const errorSvg = `
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="#1e293b"/>
  <text x="600" y="400" text-anchor="middle" font-family="system-ui" font-size="20" fill="#ef4444">
    Failed to generate stats: ${(error as Error).message}
  </text>
</svg>
    `.trim();

		return new NextResponse(errorSvg, {
			status: 500,
			headers: {
				"Content-Type": "image/svg+xml",
			},
		});
	}
}
