import { NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	try {
		const stats = await fetchGitHubStats("divineamunega");

		// Generate SVG directly - adjust height based on whether WakaTime is available
		const svgHeight = stats.wakatime ? 1350 : 1100;
		const svg = `
<svg width="800" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f0f0f;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="${svgHeight}" fill="url(#bgGradient)"/>

  <!-- Header -->
  <text x="40" y="70" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="700" fill="#ffffff" letter-spacing="-0.5">${stats.fullName}</text>
  <text x="40" y="100" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#666666">@${stats.username} • ${stats.experience} experience</text>
  <text x="760" y="100" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#666666" text-anchor="end">👁️ ${stats.profileViews} views</text>
  <line x1="40" y1="120" x2="760" y2="120" stroke="#1a1a1a" stroke-width="2"/>

  <!-- Bio -->
  <text x="40" y="165" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#999999" font-style="italic">"${stats.bio}"</text>

  <!-- Main Stats Cards -->
  <!-- Commits -->
  <rect x="40" y="210" width="226" height="100" rx="8" fill="#111111" stroke="#1f1f1f" stroke-width="1"/>
  <text x="64" y="235" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#666666" letter-spacing="1">COMMITS</text>
  <text x="64" y="275" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" fill="#ffffff">${stats.totalCommits}</text>

  <!-- Repos -->
  <rect x="287" y="210" width="226" height="100" rx="8" fill="#111111" stroke="#1f1f1f" stroke-width="1"/>
  <text x="311" y="235" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#666666" letter-spacing="1">REPOS</text>
  <text x="311" y="275" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" fill="#ffffff">${stats.totalRepos}</text>

  <!-- Stars -->
  <rect x="534" y="210" width="226" height="100" rx="8" fill="#111111" stroke="#1f1f1f" stroke-width="1"/>
  <text x="558" y="235" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#666666" letter-spacing="1">STARS</text>
  <text x="558" y="275" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" fill="#ffffff">${stats.totalStars}</text>

  <!-- Streaks -->
  <rect x="40" y="340" width="350" height="100" rx="8" fill="url(#streakGradient)" stroke="#2a2a2a" stroke-width="1"/>
  <text x="64" y="370" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#888888">🔥 Current Streak</text>
  <text x="64" y="415" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="700" fill="#ffffff">${stats.currentStreak}</text>

  <rect x="410" y="340" width="350" height="100" rx="8" fill="url(#streakGradient)" stroke="#2a2a2a" stroke-width="1"/>
  <text x="434" y="370" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#888888">📈 Longest Streak</text>
  <text x="434" y="415" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="700" fill="#ffffff">${stats.longestStreak}</text>

  <!-- Activity Insights -->
  <rect x="40" y="470" width="720" height="130" rx="8" fill="#0d0d0d" stroke="#1a1a1a" stroke-width="1"/>
  <text x="64" y="500" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#666666" letter-spacing="1">ACTIVITY INSIGHTS</text>

  <text x="64" y="530" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#888888">Most Active Day</text>
  <text x="64" y="555" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#ffffff">${stats.mostCommitDay}</text>
  <text x="64" y="575" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#555555">${stats.mostCommitDayCount} commits</text>

  <text x="264" y="530" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#888888">Peak Date</text>
  <text x="264" y="555" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#ffffff">${stats.mostActiveDate.split(',')[0]}</text>
  <text x="264" y="575" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#555555">${stats.mostActiveDateCount} commits</text>

  <!-- Notable Projects -->
  <text x="40" y="645" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#666666" letter-spacing="1">NOTABLE PROJECTS</text>

  <rect x="40" y="665" width="350" height="90" rx="6" fill="#0d0d0d" stroke="#1a1a1a" stroke-width="1"/>
  <text x="56" y="690" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#777777">Most Commits</text>
  <text x="56" y="720" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#ffffff">${stats.mostCommitProject}${stats.mostCommitProjectCount > 0 ? ` (${stats.mostCommitProjectCount} commits)` : ''}</text>

  <rect x="410" y="665" width="350" height="90" rx="6" fill="#0d0d0d" stroke="#1a1a1a" stroke-width="1"/>
  <text x="426" y="690" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#777777">⭐ Fan Favorite</text>
  <text x="426" y="720" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#ffffff">${stats.favouriteProject}</text>
  <text x="426" y="740" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#555555">${stats.favouriteProjectStars} stars</text>

  <!-- Tech Stack -->
  <text x="40" y="810" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#666666" letter-spacing="1">TECH STACK</text>

  ${stats.languages.map((lang, idx) => {
		const x = 40 + (idx % 5) * 145;
		const y = 830 + Math.floor(idx / 5) * 50;
		return `<rect x="${x}" y="${y}" width="135" height="40" rx="6" fill="#111111" stroke="#1f1f1f" stroke-width="1"/>
  <text x="${x + 67.5}" y="${y + 25}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#cccccc" text-anchor="middle">${lang}</text>`;
	}).join('\n  ')}

  ${stats.wakatime ? `
  <!-- WakaTime Stats (All Time) -->
  <text x="40" y="975" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#666666" letter-spacing="1">WAKATIME STATS</text>

  <rect x="40" y="995" width="720" height="220" rx="8" fill="#0d0d0d" stroke="#1a1a1a" stroke-width="1"/>

  <!-- Total Hours & Last 7 Days -->
  <text x="64" y="1025" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#888888">Total Hours (All Time)</text>
  <text x="64" y="1055" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#ffffff">${stats.wakatime.totalHours}</text>

  <text x="290" y="1025" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#888888">Last 7 Days</text>
  <text x="290" y="1055" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#ffffff">${stats.wakatime.last7DaysTotal}</text>

  <text x="490" y="1025" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#888888">Top OS</text>
  <text x="490" y="1055" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#ffffff">${stats.wakatime.topOS}</text>

  <!-- Favorite Languages -->
  <line x1="64" y1="1085" x2="736" y2="1085" stroke="#1a1a1a" stroke-width="1"/>

  <text x="64" y="1110" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#888888">Favorite Languages (All Time)</text>

  <text x="64" y="1145" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#ffffff">1. ${stats.wakatime.topLanguage} <tspan fill="#666666">${stats.wakatime.topLanguageTime}</tspan></text>

  <text x="64" y="1180" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#ffffff">2. ${stats.wakatime.secondLanguage} <tspan fill="#666666">${stats.wakatime.secondLanguageTime}</tspan></text>
  ` : ''}

  <!-- Footer -->
  <line x1="40" y1="${stats.wakatime ? 1260 : 1020}" x2="760" y2="${stats.wakatime ? 1260 : 1020}" stroke="#1a1a1a" stroke-width="1"/>
  <text x="40" y="${stats.wakatime ? 1290 : 1050}" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#444444">github.com/${stats.username}</text>
  <text x="760" y="${stats.wakatime ? 1290 : 1050}" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#444444" text-anchor="end">Updated ${new Date().toLocaleDateString()}</text>
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

		const errorSvg = `
<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="200" fill="#0a0a0a"/>
  <text x="400" y="100" text-anchor="middle" font-family="system-ui" font-size="16" fill="#666666">
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
