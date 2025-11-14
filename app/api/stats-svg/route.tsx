import { NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";
import satori from "satori";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	try {
		const stats = await fetchGitHubStats("divineamunega");

		// Sleek black design with experienced dev aesthetic
		const markup = (
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					background: "#0a0a0a",
					padding: "0",
				}}
			>
				<div
					style={{
						width: "100%",
						background: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)",
						display: "flex",
						flexDirection: "column",
						padding: "40px",
						gap: "28px",
					}}
				>
					{/* Header - Minimalist */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "12px",
							borderBottom: "2px solid #1a1a1a",
							paddingBottom: "20px",
						}}
					>
						<div
							style={{
								fontSize: "32px",
								fontWeight: "700",
								color: "#ffffff",
								letterSpacing: "-0.5px",
							}}
						>
							{stats.fullName}
						</div>
						<div
							style={{
								fontSize: "16px",
								color: "#666666",
								display: "flex",
								gap: "16px",
							}}
						>
							<span>@{stats.username}</span>
							<span>•</span>
							<span>{stats.experience} experience</span>
						</div>
					</div>

					{/* Bio */}
					<div
						style={{
							fontSize: "18px",
							color: "#999999",
							lineHeight: "1.6",
							fontStyle: "italic",
						}}
					>
						&ldquo;{stats.bio}&rdquo;
					</div>

					{/* Main Stats Grid */}
					<div
						style={{
							display: "flex",
							gap: "20px",
						}}
					>
						{/* Commits */}
						<div
							style={{
								flex: 1,
								background: "#111111",
								border: "1px solid #1f1f1f",
								borderRadius: "8px",
								padding: "24px",
								display: "flex",
								flexDirection: "column",
								gap: "12px",
							}}
						>
							<div style={{ fontSize: "13px", color: "#666666", textTransform: "uppercase", letterSpacing: "1px" }}>
								COMMITS
							</div>
							<div style={{ fontSize: "36px", fontWeight: "700", color: "#ffffff" }}>
								{stats.totalCommits}
							</div>
						</div>

						{/* Repos */}
						<div
							style={{
								flex: 1,
								background: "#111111",
								border: "1px solid #1f1f1f",
								borderRadius: "8px",
								padding: "24px",
								display: "flex",
								flexDirection: "column",
								gap: "12px",
							}}
						>
							<div style={{ fontSize: "13px", color: "#666666", textTransform: "uppercase", letterSpacing: "1px" }}>
								REPOS
							</div>
							<div style={{ fontSize: "36px", fontWeight: "700", color: "#ffffff" }}>
								{stats.totalRepos}
							</div>
						</div>

						{/* Stars */}
						<div
							style={{
								flex: 1,
								background: "#111111",
								border: "1px solid #1f1f1f",
								borderRadius: "8px",
								padding: "24px",
								display: "flex",
								flexDirection: "column",
								gap: "12px",
							}}
						>
							<div style={{ fontSize: "13px", color: "#666666", textTransform: "uppercase", letterSpacing: "1px" }}>
								STARS
							</div>
							<div style={{ fontSize: "36px", fontWeight: "700", color: "#ffffff" }}>
								{stats.totalStars}
							</div>
						</div>
					</div>

					{/* Streaks */}
					<div
						style={{
							display: "flex",
							gap: "20px",
						}}
					>
						<div
							style={{
								flex: 1,
								background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)",
								border: "1px solid #2a2a2a",
								borderRadius: "8px",
								padding: "24px",
								display: "flex",
								flexDirection: "column",
								gap: "8px",
							}}
						>
							<div style={{ fontSize: "13px", color: "#888888" }}>
								🔥 Current Streak
							</div>
							<div style={{ fontSize: "32px", fontWeight: "700", color: "#ffffff" }}>
								{stats.currentStreak}
							</div>
						</div>

						<div
							style={{
								flex: 1,
								background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)",
								border: "1px solid #2a2a2a",
								borderRadius: "8px",
								padding: "24px",
								display: "flex",
								flexDirection: "column",
								gap: "8px",
							}}
						>
							<div style={{ fontSize: "13px", color: "#888888" }}>
								📈 Longest Streak
							</div>
							<div style={{ fontSize: "32px", fontWeight: "700", color: "#ffffff" }}>
								{stats.longestStreak}
							</div>
						</div>
					</div>

					{/* Activity Insights */}
					<div
						style={{
							background: "#0d0d0d",
							border: "1px solid #1a1a1a",
							borderRadius: "8px",
							padding: "24px",
							display: "flex",
							flexDirection: "column",
							gap: "16px",
						}}
					>
						<div style={{ fontSize: "14px", color: "#666666", textTransform: "uppercase", letterSpacing: "1px" }}>
							ACTIVITY INSIGHTS
						</div>
						<div style={{ display: "flex", gap: "40px" }}>
							<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
								<div style={{ fontSize: "13px", color: "#888888" }}>Most Active Day</div>
								<div style={{ fontSize: "16px", color: "#ffffff", fontWeight: "600" }}>
									{stats.mostCommitDay}
								</div>
								<div style={{ fontSize: "12px", color: "#555555" }}>
									{stats.mostCommitDayCount} commits
								</div>
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
								<div style={{ fontSize: "13px", color: "#888888" }}>Peak Date</div>
								<div style={{ fontSize: "16px", color: "#ffffff", fontWeight: "600" }}>
									{stats.mostActiveDate.split(',')[0]}
								</div>
								<div style={{ fontSize: "12px", color: "#555555" }}>
									{stats.mostActiveDateCount} commits
								</div>
							</div>
						</div>
					</div>

					{/* Notable Projects */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "16px",
						}}
					>
						<div style={{ fontSize: "14px", color: "#666666", textTransform: "uppercase", letterSpacing: "1px" }}>
							NOTABLE PROJECTS
						</div>
						<div style={{ display: "flex", gap: "20px" }}>
							<div
								style={{
									flex: 1,
									background: "#0d0d0d",
									border: "1px solid #1a1a1a",
									borderRadius: "6px",
									padding: "16px",
									display: "flex",
									flexDirection: "column",
									gap: "8px",
								}}
							>
								<div style={{ fontSize: "12px", color: "#777777" }}>Most Commits</div>
								<div style={{ fontSize: "16px", color: "#ffffff", fontWeight: "600" }}>
									{stats.mostCommitProject}
								</div>
							</div>
							<div
								style={{
									flex: 1,
									background: "#0d0d0d",
									border: "1px solid #1a1a1a",
									borderRadius: "6px",
									padding: "16px",
									display: "flex",
									flexDirection: "column",
									gap: "8px",
								}}
							>
								<div style={{ fontSize: "12px", color: "#777777" }}>⭐ Fan Favorite</div>
								<div style={{ fontSize: "16px", color: "#ffffff", fontWeight: "600" }}>
									{stats.favouriteProject}
								</div>
								<div style={{ fontSize: "12px", color: "#555555" }}>
									{stats.favouriteProjectStars} stars
								</div>
							</div>
						</div>
					</div>

					{/* Tech Stack */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "16px",
						}}
					>
						<div style={{ fontSize: "14px", color: "#666666", textTransform: "uppercase", letterSpacing: "1px" }}>
							TECH STACK
						</div>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
							{stats.languages.map((lang, idx) => (
								<div
									key={idx}
									style={{
										background: "#111111",
										border: "1px solid #1f1f1f",
										borderRadius: "6px",
										padding: "10px 16px",
										fontSize: "14px",
										color: "#cccccc",
										fontWeight: "500",
									}}
								>
									{lang}
								</div>
							))}
						</div>
					</div>

					{/* Footer */}
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							paddingTop: "20px",
							borderTop: "1px solid #1a1a1a",
							fontSize: "12px",
							color: "#444444",
						}}
					>
						<span>github.com/{stats.username}</span>
						<span>Updated {new Date().toLocaleDateString()}</span>
					</div>
				</div>
			</div>
		);

		const svg = await satori(markup, {
			width: 800,
			height: 1100,
			fonts: [
				{
					name: "Inter",
					data: await fetch(
						"https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
					).then((res) => res.arrayBuffer()),
					weight: 400,
					style: "normal",
				},
				{
					name: "Inter",
					data: await fetch(
						"https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff"
					).then((res) => res.arrayBuffer()),
					weight: 600,
					style: "normal",
				},
				{
					name: "Inter",
					data: await fetch(
						"https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff"
					).then((res) => res.arrayBuffer()),
					weight: 700,
					style: "normal",
				},
			],
		});

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
