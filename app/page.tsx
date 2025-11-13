import React from "react";
import { Terminal, GitBranch, Star, Code, TrendingUp, GitCommit, Flame, Calendar, Clock } from "lucide-react";
import { fetchGitHubStats, GitHubStats } from "@/lib/github";

interface StatLineProps {
	label: string;
	value: string;
	color: string;
	icon?: React.ReactNode;
	compact?: boolean;
}

const StatLine: React.FC<StatLineProps> = ({
	label,
	value,
	color,
	icon,
	compact,
}) => {
	return (
		<div className="flex items-center gap-2">
			{icon && <span className={`text-${color}`}>{icon}</span>}
			<span
				className={`text-${color} ${
					compact ? "min-w-[120px]" : "min-w-[100px]"
				}`}
			>
				{label}:
			</span>
			<span className="text-white">{value}</span>
		</div>
	);
};

export default async function Home() {
	// Fetch real GitHub stats server-side
	const stats = await fetchGitHubStats("divineamunega");

	return (
		<div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-blue-100 min-h-screen flex items-center justify-center p-4 sm:p-8">
			<div className="max-w-4xl w-full">
				<div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-blue-500/30 shadow-2xl animate-fade-in">
					<div className="mb-6">
						<div className="flex items-center gap-2 text-blue-400 text-xl sm:text-2xl font-bold mb-2">
							<Terminal className="w-5 h-5 sm:w-6 sm:h-6" />
							<span>{stats.username}@github</span>
						</div>
						<div className="text-blue-500/40">
							─────────────────────────────────────────────────────
						</div>
					</div>

					{/* Main Stats Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
						<StatLine label="Name" value={stats.fullName} color="blue-300" />
						<StatLine
							label="Experience"
							value={stats.experience}
							color="slate-400"
						/>
						<div className="col-span-1 sm:col-span-2">
							<StatLine label="Bio" value={stats.bio} color="slate-400" />
						</div>
					</div>

					<div className="text-blue-500/40 my-4">
						─────────────────────────────────────────────────────
					</div>

					{/* Commit Activity */}
					<div className="mb-6">
						<div className="text-cyan-300 font-bold mb-4 flex items-center gap-2 text-lg">
							<GitBranch className="w-5 h-5" />
							Commit Activity
						</div>

						{/* Stats Cards Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{/* Commits Card */}
							<div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 hover:bg-cyan-500/15 transition-all">
								<div className="flex items-center gap-2 text-cyan-300 text-sm mb-2">
									<GitCommit className="w-4 h-4" />
									<span className="font-medium">Total Commits</span>
								</div>
								<div className="text-2xl font-bold text-white">{stats.totalCommits}</div>
							</div>

							{/* Repos Card */}
							<div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 hover:bg-cyan-500/15 transition-all">
								<div className="flex items-center gap-2 text-cyan-300 text-sm mb-2">
									<Code className="w-4 h-4" />
									<span className="font-medium">Total Repos</span>
								</div>
								<div className="text-2xl font-bold text-white">{stats.totalRepos}</div>
							</div>

							{/* Stars Card */}
							<div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 hover:bg-yellow-500/15 transition-all">
								<div className="flex items-center gap-2 text-yellow-300 text-sm mb-2">
									<Star className="w-4 h-4" />
									<span className="font-medium">Total Stars</span>
								</div>
								<div className="text-2xl font-bold text-white">{stats.totalStars}</div>
							</div>
						</div>

						{/* Streak Section */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							{/* Current Streak */}
							<div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 hover:bg-emerald-500/15 transition-all">
								<div className="flex items-center gap-2 text-emerald-300 text-sm mb-2">
									<Flame className="w-4 h-4" />
									<span className="font-medium">Current Streak</span>
								</div>
								<div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
							</div>

							{/* Longest Streak */}
							<div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 hover:bg-emerald-500/15 transition-all">
								<div className="flex items-center gap-2 text-emerald-300 text-sm mb-2">
									<TrendingUp className="w-4 h-4" />
									<span className="font-medium">Longest Streak</span>
								</div>
								<div className="text-2xl font-bold text-white">{stats.longestStreak}</div>
							</div>
						</div>

						{/* Activity Patterns */}
						<div className="mt-4 bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/30 rounded-lg p-4">
							<div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-3">
								<Calendar className="w-4 h-4" />
								Activity Patterns
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<div className="text-violet-200 text-xs mb-1 flex items-center gap-1">
										<Clock className="w-3 h-3" />
										Most Active Day of Week
									</div>
									<div className="text-white font-semibold">
										{stats.mostCommitDay}
									</div>
									<div className="text-violet-300 text-sm">
										{stats.mostCommitDayCount} commits total
									</div>
								</div>
								<div>
									<div className="text-pink-200 text-xs mb-1 flex items-center gap-1">
										<Star className="w-3 h-3" />
										Most Active Single Date
									</div>
									<div className="text-white font-semibold text-sm">
										{stats.mostActiveDate}
									</div>
									<div className="text-pink-300 text-sm">
										{stats.mostActiveDateCount} commits
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="text-blue-500/40 my-4">
						─────────────────────────────────────────────────────
					</div>

					{/* Projects */}
					<div className="mb-6">
						<div className="text-sky-300 font-bold mb-3 flex items-center gap-2">
							<Code className="w-4 h-4" />
							Notable Projects
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 ml-6">
							<StatLine
								label="Most Commits"
								value={stats.mostCommitProject}
								color="sky-300"
								compact
							/>
							<StatLine
								label="Fans Favourite"
								value={`${stats.favouriteProject} with ${stats.favouriteProjectStars} stars`}
								color="amber-300"
								compact
								icon={<Star className="w-3 h-3" />}
							/>
						</div>
					</div>

					<div className="text-blue-500/40 my-4">
						─────────────────────────────────────────────────────
					</div>

					{/* Tech Stack */}
					<div className="mb-6">
						<div className="text-blue-300 font-bold mb-3 flex items-center gap-2">
							<TrendingUp className="w-4 h-4" />
							Tech Stack
						</div>
						<div className="ml-6">
							<div className="flex flex-wrap gap-2">
								{stats.languages.map((lang, idx) => (
									<span
										key={idx}
										className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded border border-blue-400/30 text-sm transition-all hover:bg-blue-500/30 hover:border-blue-400/50"
									>
										{lang}
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="mt-6 pt-4 border-t border-blue-500/30">
						<div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
							<Terminal className="w-3 h-3" />
							<span>Building with passion, shipping with purpose</span>
						</div>
					</div>
				</div>

				{/* Bottom Info Bar */}
				<div className="mt-6 text-center text-slate-400 text-xs">
					<span className="text-blue-400">◆</span> Last updated:{" "}
					{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}{" "}
					<span className="text-blue-400">◆</span>
				</div>
			</div>
		</div>
	);
}
