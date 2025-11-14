import { NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	try {
		const stats = await fetchGitHubStats("divineamunega");

		// SVG with gradient background matching the current design
		const svg = `
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
    <style>
      .title { font: bold 24px 'Segoe UI', system-ui, sans-serif; fill: #93c5fd; }
      .username { font: bold 20px 'Segoe UI', system-ui, sans-serif; fill: #60a5fa; }
      .section-title { font: bold 18px 'Segoe UI', system-ui, sans-serif; fill: #67e8f9; }
      .label { font: 14px 'Segoe UI', system-ui, sans-serif; fill: #93c5fd; }
      .value { font: 14px 'Segoe UI', system-ui, sans-serif; fill: #ffffff; }
      .stat-card { fill: rgba(6, 182, 212, 0.1); }
      .stat-label { font: 12px 'Segoe UI', system-ui, sans-serif; fill: #67e8f9; }
      .stat-value { font: bold 24px 'Segoe UI', system-ui, sans-serif; fill: #ffffff; }
      .streak-card { fill: rgba(16, 185, 129, 0.1); }
      .streak-label { font: 12px 'Segoe UI', system-ui, sans-serif; fill: #6ee7b7; }
      .lang-badge { font: 12px 'Segoe UI', system-ui, sans-serif; fill: #bfdbfe; }
      .divider { stroke: #3b82f680; stroke-width: 1; }
      .footer { font: 10px 'Segoe UI', system-ui, sans-serif; fill: #94a3b8; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="800" fill="url(#bg)"/>

  <!-- Main Container with border -->
  <rect x="30" y="30" width="1140" height="740" rx="12" fill="#1e293b80" stroke="#3b82f650" stroke-width="2"/>

  <!-- Header -->
  <text x="60" y="80" class="username">${stats.username}@github</text>
  <line x1="60" y1="95" x2="1140" y2="95" class="divider"/>

  <!-- Basic Info -->
  <text x="60" y="135" class="label">Name:</text>
  <text x="180" y="135" class="value">${stats.fullName}</text>

  <text x="660" y="135" class="label">Experience:</text>
  <text x="780" y="135" class="value">${stats.experience}</text>

  <text x="60" y="165" class="label">Bio:</text>
  <text x="180" y="165" class="value">${stats.bio.substring(0, 80)}</text>

  <line x1="60" y1="185" x2="1140" y2="185" class="divider"/>

  <!-- Commit Activity Section -->
  <text x="60" y="225" class="section-title">📊 Commit Activity</text>

  <!-- Stats Cards Row 1 -->
  <!-- Total Commits Card -->
  <rect x="60" y="245" width="340" height="90" rx="8" class="stat-card" stroke="#06b6d450" stroke-width="1"/>
  <text x="80" y="270" class="stat-label">Total Commits</text>
  <text x="80" y="310" class="stat-value">${stats.totalCommits}</text>

  <!-- Total Repos Card -->
  <rect x="430" y="245" width="340" height="90" rx="8" class="stat-card" stroke="#06b6d450" stroke-width="1"/>
  <text x="450" y="270" class="stat-label">Total Repos</text>
  <text x="450" y="310" class="stat-value">${stats.totalRepos}</text>

  <!-- Total Stars Card -->
  <rect x="800" y="245" width="340" height="90" rx="8" fill="rgba(234, 179, 8, 0.1)" stroke="#eab30850" stroke-width="1"/>
  <text x="820" y="270" class="stat-label">⭐ Total Stars</text>
  <text x="820" y="310" class="stat-value">${stats.totalStars}</text>

  <!-- Streak Cards Row 2 -->
  <!-- Current Streak -->
  <rect x="60" y="360" width="540" height="90" rx="8" class="streak-card" stroke="#10b98150" stroke-width="1"/>
  <text x="80" y="385" class="streak-label">🔥 Current Streak</text>
  <text x="80" y="425" class="stat-value">${stats.currentStreak}</text>

  <!-- Longest Streak -->
  <rect x="630" y="360" width="510" height="90" rx="8" class="streak-card" stroke="#10b98150" stroke-width="1"/>
  <text x="650" y="385" class="streak-label">📈 Longest Streak</text>
  <text x="650" y="425" class="stat-value">${stats.longestStreak}</text>

  <!-- Activity Patterns -->
  <rect x="60" y="475" width="1080" height="100" rx="8" fill="rgba(139, 92, 246, 0.1)" stroke="#8b5cf650" stroke-width="1"/>
  <text x="80" y="500" class="streak-label">📅 Activity Patterns</text>

  <text x="80" y="530" class="stat-label">Most Active Day of Week</text>
  <text x="80" y="555" class="value">${stats.mostCommitDay} (${stats.mostCommitDayCount} commits)</text>

  <text x="640" y="530" class="stat-label">Most Active Single Date</text>
  <text x="640" y="555" class="value">${stats.mostActiveDate.substring(0, 30)}</text>

  <line x1="60" y1="595" x2="1140" y2="595" class="divider"/>

  <!-- Notable Projects -->
  <text x="60" y="635" class="section-title">💻 Notable Projects</text>

  <text x="60" y="665" class="label">Most Commits:</text>
  <text x="220" y="665" class="value">${stats.mostCommitProject}</text>

  <text x="640" y="665" class="label">⭐ Fans Favourite:</text>
  <text x="820" y="665" class="value">${stats.favouriteProject} (${stats.favouriteProjectStars} stars)</text>

  <line x1="60" y1="685" x2="1140" y2="685" class="divider"/>

  <!-- Tech Stack -->
  <text x="60" y="725" class="section-title">🔧 Tech Stack</text>
  ${stats.languages
		.slice(0, 8)
		.map(
			(lang, idx) => `
    <rect x="${80 + idx * 130}" y="730" width="${Math.min(lang.length * 8 + 20, 120)}" height="28" rx="4" fill="#3b82f630" stroke="#60a5fa50" stroke-width="1"/>
    <text x="${90 + idx * 130}" y="750" class="lang-badge">${lang}</text>
  `
		)
		.join("")}

  <!-- Footer -->
  <text x="600" y="790" class="footer" text-anchor="middle">Building with passion, shipping with purpose • Last updated: ${new Date().toLocaleDateString()}</text>
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
