import { NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";
import satori from "satori";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	try {
		const stats = await fetchGitHubStats("divineamunega");

		// Create JSX for satori - matches your beautiful design
		const markup = (
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
					padding: "32px",
				}}
			>
				<div
					style={{
						width: "100%",
						maxWidth: "832px",
						background: "rgba(30, 41, 59, 0.5)",
						borderRadius: "16px",
						padding: "32px",
						border: "1px solid rgba(59, 130, 246, 0.3)",
						display: "flex",
						flexDirection: "column",
						gap: "24px",
					}}
				>
					{/* Header */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "8px",
						}}
					>
						<div
							style={{
								fontSize: "28px",
								fontWeight: "bold",
								color: "#60a5fa",
							}}
						>
							{stats.username}@github
						</div>
						<div
							style={{
								color: "rgba(59, 130, 246, 0.25)",
								fontSize: "16px",
							}}
						>
							─────────────────────────────────────────────
						</div>
					</div>

					{/* Basic Info */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "12px",
						}}
					>
						<div style={{ display: "flex", gap: "8px", fontSize: "16px" }}>
							<span style={{ color: "#93c5fd" }}>Name:</span>
							<span style={{ color: "#ffffff" }}>{stats.fullName}</span>
						</div>
						<div style={{ display: "flex", gap: "8px", fontSize: "16px" }}>
							<span style={{ color: "#93c5fd" }}>Experience:</span>
							<span style={{ color: "#ffffff" }}>{stats.experience}</span>
						</div>
						<div style={{ display: "flex", gap: "8px", fontSize: "16px" }}>
							<span style={{ color: "#93c5fd" }}>Bio:</span>
							<span style={{ color: "#ffffff" }}>{stats.bio}</span>
						</div>
					</div>

					{/* Divider */}
					<div
						style={{
							color: "rgba(59, 130, 246, 0.25)",
							fontSize: "16px",
						}}
					>
						─────────────────────────────────────────────
					</div>

					{/* Commit Activity */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "16px",
						}}
					>
						<div
							style={{
								fontSize: "20px",
								fontWeight: "bold",
								color: "#67e8f9",
							}}
						>
							📊 Commit Activity
						</div>

						{/* Stats Cards */}
						<div style={{ display: "flex", gap: "16px" }}>
							<div
								style={{
									flex: 1,
									background: "rgba(6, 182, 212, 0.1)",
									border: "1px solid rgba(6, 182, 212, 0.3)",
									borderRadius: "12px",
									padding: "16px",
									display: "flex",
									flexDirection: "column",
									gap: "8px",
								}}
							>
								<div style={{ fontSize: "14px", color: "#67e8f9" }}>
									Total Commits
								</div>
								<div
									style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff" }}
								>
									{stats.totalCommits}
								</div>
							</div>
							<div
								style={{
									flex: 1,
									background: "rgba(6, 182, 212, 0.1)",
									border: "1px solid rgba(6, 182, 212, 0.3)",
									borderRadius: "12px",
									padding: "16px",
									display: "flex",
									flexDirection: "column",
									gap: "8px",
								}}
							>
								<div style={{ fontSize: "14px", color: "#67e8f9" }}>
									Total Repos
								</div>
								<div
									style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff" }}
								>
									{stats.totalRepos}
								</div>
							</div>
							<div
								style={{
									flex: 1,
									background: "rgba(234, 179, 8, 0.1)",
									border: "1px solid rgba(234, 179, 8, 0.3)",
									borderRadius: "12px",
									padding: "16px",
									display: "flex",
									flexDirection: "column",
									gap: "8px",
								}}
							>
								<div style={{ fontSize: "14px", color: "#fcd34d" }}>
									⭐ Total Stars
								</div>
								<div
									style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff" }}
								>
									{stats.totalStars}
								</div>
							</div>
						</div>

						{/* Streak Cards */}
						<div style={{ display: "flex", gap: "16px" }}>
							<div
								style={{
									flex: 1,
									background: "rgba(16, 185, 129, 0.1)",
									border: "1px solid rgba(16, 185, 129, 0.3)",
									borderRadius: "12px",
									padding: "16px",
									display: "flex",
									flexDirection: "column",
									gap: "8px",
								}}
							>
								<div style={{ fontSize: "14px", color: "#6ee7b7" }}>
									🔥 Current Streak
								</div>
								<div
									style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff" }}
								>
									{stats.currentStreak}
								</div>
							</div>
							<div
								style={{
									flex: 1,
									background: "rgba(16, 185, 129, 0.1)",
									border: "1px solid rgba(16, 185, 129, 0.3)",
									borderRadius: "12px",
									padding: "16px",
									display: "flex",
									flexDirection: "column",
									gap: "8px",
								}}
							>
								<div style={{ fontSize: "14px", color: "#6ee7b7" }}>
									📈 Longest Streak
								</div>
								<div
									style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff" }}
								>
									{stats.longestStreak}
								</div>
							</div>
						</div>

						{/* Activity Patterns */}
						<div
							style={{
								background:
									"linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
								border: "1px solid rgba(139, 92, 246, 0.3)",
								borderRadius: "12px",
								padding: "16px",
								display: "flex",
								flexDirection: "column",
								gap: "12px",
							}}
						>
							<div style={{ fontSize: "14px", color: "#c4b5fd" }}>
								📅 Activity Patterns
							</div>
							<div style={{ display: "flex", gap: "32px" }}>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "4px",
									}}
								>
									<div style={{ fontSize: "12px", color: "#ddd6fe" }}>
										Most Active Day
									</div>
									<div style={{ fontSize: "14px", color: "#ffffff" }}>
										{stats.mostCommitDay} ({stats.mostCommitDayCount})
									</div>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "4px",
									}}
								>
									<div style={{ fontSize: "12px", color: "#fbcfe8" }}>
										Most Active Date
									</div>
									<div style={{ fontSize: "14px", color: "#ffffff" }}>
										{stats.mostActiveDate.substring(0, 25)}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Divider */}
					<div
						style={{
							color: "rgba(59, 130, 246, 0.25)",
							fontSize: "16px",
						}}
					>
						─────────────────────────────────────────────
					</div>

					{/* Notable Projects */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "12px",
						}}
					>
						<div
							style={{
								fontSize: "20px",
								fontWeight: "bold",
								color: "#7dd3fc",
							}}
						>
							💻 Notable Projects
						</div>
						<div style={{ display: "flex", gap: "8px", fontSize: "16px" }}>
							<span style={{ color: "#7dd3fc" }}>Most Commits:</span>
							<span style={{ color: "#ffffff" }}>{stats.mostCommitProject}</span>
						</div>
						<div style={{ display: "flex", gap: "8px", fontSize: "16px" }}>
							<span style={{ color: "#fcd34d" }}>⭐ Favourite:</span>
							<span style={{ color: "#ffffff" }}>
								{stats.favouriteProject} ({stats.favouriteProjectStars} stars)
							</span>
						</div>
					</div>

					{/* Divider */}
					<div
						style={{
							color: "rgba(59, 130, 246, 0.25)",
							fontSize: "16px",
						}}
					>
						─────────────────────────────────────────────
					</div>

					{/* Tech Stack */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "12px",
						}}
					>
						<div
							style={{
								fontSize: "20px",
								fontWeight: "bold",
								color: "#93c5fd",
							}}
						>
							🔧 Tech Stack
						</div>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
							{stats.languages.map((lang, idx) => (
								<div
									key={idx}
									style={{
										background: "rgba(59, 130, 246, 0.2)",
										border: "1px solid rgba(96, 165, 250, 0.3)",
										borderRadius: "6px",
										padding: "8px 12px",
										fontSize: "14px",
										color: "#bfdbfe",
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
							justifyContent: "center",
							fontSize: "12px",
							color: "#94a3b8",
							paddingTop: "8px",
							borderTop: "1px solid rgba(59, 130, 246, 0.2)",
						}}
					>
						Building with passion • Last updated: {new Date().toLocaleDateString()}
					</div>
				</div>
			</div>
		);

		const svg = await satori(markup, {
			width: 896,
			height: 1200,
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
<svg width="896" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="896" height="200" fill="#1e293b"/>
  <text x="448" y="100" text-anchor="middle" font-family="system-ui" font-size="18" fill="#ef4444">
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
