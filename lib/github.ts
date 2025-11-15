import { Octokit } from "@octokit/rest";
import axios from "axios";
import { Agent as HttpsAgent } from "https";

export interface GitHubStats {
	username: string;
	fullName: string;
	bio: string;
	totalCommits: string;
	currentStreak: string;
	longestStreak: string;
	mostCommitDay: string;
	mostCommitDayCount: number;
	mostActiveDate: string;
	mostActiveDateCount: number;
	mostCommitProject: string;
	mostCommitProjectCount: number;
	favouriteProject: string;
	favouriteProjectStars: number;
	languages: string[];
	experience: string;
	totalRepos: string;
	totalStars: string;
	contributionsThisYear: string;
	profileViews: string;
	wakatime?: WakaTimeStats;
}

export interface WakaTimeStats {
	totalHours: string; // All-time total hours
	last7DaysTotal: string; // Last 7 days total
	topLanguage: string; // Top language name
	topLanguageTime: string; // Top language time
	secondLanguage: string; // Second language name
	secondLanguageTime: string; // Second language time
	topOS: string; // Top operating system
}

interface ContributionDay {
	date: string;
	count: number;
}

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

// Simple in-memory profile view counter (resets on server restart)
// For production, use a database or external service
let profileViewCount = 0;

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
	try {
		// Increment profile view counter
		profileViewCount++;
		// Fetch user data
		const { data: user } = await octokit.users.getByUsername({ username });

		// Fetch repositories
		const { data: repos } = await octokit.repos.listForUser({
			username,
			per_page: 100,
			sort: "updated",
		});

		// Calculate total stars
		const totalStars = repos.reduce(
			(acc, repo) => acc + (repo.stargazers_count || 0),
			0
		);

		// Get languages
		const languageSet = new Set<string>();
		repos.forEach((repo) => {
			if (repo.language) {
				languageSet.add(repo.language);
			}
		});
		const languages = Array.from(languageSet).slice(0, 6);

		// Find most starred repo (favorite project)
		const mostStarredRepo = repos.reduce((prev, current) =>
			(prev.stargazers_count || 0) > (current.stargazers_count || 0)
				? prev
				: current
		);

		// Fetch contribution data from GitHub contribution API
		const contributionData = await fetchContributionData(username);

		// Calculate streaks and commit stats
		const {
			currentStreak,
			longestStreak,
			totalContributions,
			mostCommitDay,
			mostCommitDayCount,
			mostActiveDate,
			mostActiveDateCount,
			mostCommitProject,
			mostCommitProjectCount,
		} = await calculateStreaksAndStats(contributionData, repos, username);

		// Calculate experience (years since account creation)
		const accountAge =
			new Date().getFullYear() - new Date(user.created_at!).getFullYear();
		const experience = accountAge > 0 ? `${accountAge}+ years` : "< 1 year";

		// Fetch WakaTime stats if API key is available
		const wakatime = await fetchWakaTimeStats(username);

		return {
			username: user.login,
			fullName: user.name || user.login,
			bio: user.bio || "No bio available",
			totalCommits: totalContributions.toLocaleString(),
			currentStreak: `${currentStreak} days`,
			longestStreak: `${longestStreak} days`,
			mostCommitDay,
			mostCommitDayCount,
			mostActiveDate,
			mostActiveDateCount,
			mostCommitProject: mostCommitProject || repos[0]?.name || "N/A",
			mostCommitProjectCount,
			favouriteProject: mostStarredRepo?.name || "N/A",
			favouriteProjectStars: mostStarredRepo?.stargazers_count || 0,
			languages,
			experience,
			totalRepos: user.public_repos.toString(),
			totalStars: totalStars.toLocaleString(),
			contributionsThisYear: totalContributions.toLocaleString(),
			profileViews: profileViewCount.toLocaleString(),
			wakatime,
		};
	} catch (error) {
		console.error("Error fetching GitHub stats:", error);
		// Return fallback data
		return getFallbackStats(username);
	}
}

async function fetchWakaTimeStats(
	username: string
): Promise<WakaTimeStats | undefined> {
	const apiKey = process.env.WAKATIME_API_KEY;

	if (!apiKey || apiKey === "your_wakatime_api_key_here") {
		return undefined;
	}

	try {
		// Create a custom HTTPS agent with IPv4 preference to avoid connection issues
		const httpsAgent = new HttpsAgent({
			family: 4, // Force IPv4 to avoid IPv6 timeout issues
			keepAlive: true,
		});

		const axiosConfig = {
			params: { api_key: apiKey },
			httpsAgent: httpsAgent,
			timeout: 30000,
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; Node.js)",
				Accept: "application/json",
			},
		};

		// Fetch all-time stats
		const allTimeResponse = await axios.get(
			`https://wakatime.com/api/v1/users/current/stats/all_time`,
			axiosConfig
		);

		// Fetch last 7 days stats
		const last7DaysResponse = await axios.get(
			`https://wakatime.com/api/v1/users/current/stats/last_7_days`,
			axiosConfig
		);

		if (
			!allTimeResponse.data ||
			!allTimeResponse.data.data ||
			!last7DaysResponse.data ||
			!last7DaysResponse.data.data
		) {
			return undefined;
		}

		const allTimeStats = allTimeResponse.data.data;
		const last7DaysStats = last7DaysResponse.data.data;

		// Get all-time total hours
		const totalHours = (
			allTimeStats.total_seconds_including_other_language / 3600
		).toFixed(0);

		// Get last 7 days total
		const last7DaysTotal = (
			last7DaysStats.total_seconds_including_other_language / 3600
		).toFixed(1);

		// Get top 2 languages from all-time stats
		const topLanguage = allTimeStats.languages?.[0]?.name || "N/A";
		const topLanguageTime = allTimeStats.languages?.[0]?.text || "N/A";

		const secondLanguage = allTimeStats.languages?.[1]?.name || "N/A";
		const secondLanguageTime = allTimeStats.languages?.[1]?.text || "N/A";

		// Get top OS
		const topOS = allTimeStats.operating_systems?.[0]?.name || "N/A";

		return {
			totalHours: `${totalHours} hrs`,
			last7DaysTotal: `${last7DaysTotal} hrs`,
			topLanguage,
			topLanguageTime,
			secondLanguage,
			secondLanguageTime,
			topOS,
		};
	} catch (error) {
		// Silently fail - WakaTime stats are optional
		if (axios.isAxiosError(error)) {
			console.error(error);
			console.error(
				"WakaTime API error:",
				error.response?.status,
				error.message
			);
		} else if (error instanceof Error) {
			console.error("WakaTime error:", error.message);
		}
		return undefined;
	}
}

async function fetchContributionData(
	username: string
): Promise<ContributionDay[]> {
	try {
		const response = await fetch(
			`https://github-contributions-api.jogruber.de/v4/${username}`
		);
		const data = await response.json();

		// The API returns contributions as a flat array
		if (data.contributions && Array.isArray(data.contributions)) {
			return data.contributions.map((day: any) => ({
				date: day.date,
				count: day.count,
			}));
		}
		return [];
	} catch (error) {
		console.error("Error fetching contribution data:", error);
		return [];
	}
}

async function calculateStreaksAndStats(
	contributions: ContributionDay[],
	repos: any[],
	username: string
) {
	let currentStreak = 0;
	let longestStreak = 0;
	let tempStreak = 0;
	let totalContributions = 0;

	// Sort contributions by date (oldest first for proper iteration)
	const sortedContributions = [...contributions].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);

	// Calculate total contributions and longest streak
	for (let i = 0; i < sortedContributions.length; i++) {
		totalContributions += sortedContributions[i].count;

		if (sortedContributions[i].count > 0) {
			tempStreak++;
			longestStreak = Math.max(longestStreak, tempStreak);
		} else {
			tempStreak = 0;
		}
	}

	// Calculate current streak (going backwards from yesterday)
	// We check from yesterday because today might not have contributions yet
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Create a map for quick date lookup
	const contributionMap = new Map<string, number>();
	contributions.forEach((day) => {
		contributionMap.set(day.date, day.count);
	});

	// Start from yesterday and go backwards
	let checkDate = new Date(today);
	checkDate.setDate(checkDate.getDate() - 1);

	while (true) {
		const dateStr = checkDate.toISOString().split("T")[0];
		const count = contributionMap.get(dateStr);

		if (count && count > 0) {
			currentStreak++;
			checkDate.setDate(checkDate.getDate() - 1);
		} else {
			break;
		}
	}

	// Calculate most active day of the week
	const dayContributions: { [key: string]: number } = {};
	contributions.forEach((day) => {
		const dayOfWeek = new Date(day.date).toLocaleDateString("en-US", {
			weekday: "long",
		});
		dayContributions[dayOfWeek] =
			(dayContributions[dayOfWeek] || 0) + day.count;
	});

	let mostCommitDay = "N/A";
	let mostCommitDayCount = 0;
	if (Object.entries(dayContributions).length > 0) {
		const [day, count] = Object.entries(dayContributions).reduce((a, b) =>
			a[1] > b[1] ? a : b
		);
		mostCommitDay = day;
		mostCommitDayCount = count;
	}

	// Find most active specific date
	let mostActiveDate = "N/A";
	let mostActiveDateCount = 0;
	if (contributions.length > 0) {
		const mostActiveDay = contributions.reduce((prev, current) =>
			current.count > prev.count ? current : prev
		);
		mostActiveDateCount = mostActiveDay.count;

		// Format the date nicely: "Monday January 1 2005"
		const date = new Date(mostActiveDay.date);
		mostActiveDate = date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	// Find most committed project by fetching commit counts for each repo
	let mostCommitProject = "N/A";
	let mostCommitProjectCount = 0;

	try {
		// Fetch commit counts for top repos (limit to 10 to avoid rate limits)
		const topRepos = repos.slice(0, 10);
		const repoCommitCounts = await Promise.all(
			topRepos.map(async (repo) => {
				try {
					const { data: commits } = await octokit.repos.listCommits({
						owner: username,
						repo: repo.name,
						author: username,
						per_page: 1,
					});

					// Get the total count from the Link header if available
					// Otherwise just count what we can fetch (limited approach)
					const response = await octokit.repos.listCommits({
						owner: username,
						repo: repo.name,
						author: username,
						per_page: 100,
					});

					return {
						name: repo.name,
						count: response.data.length,
					};
				} catch {
					return { name: repo.name, count: 0 };
				}
			})
		);

		// Find the repo with most commits
		const maxCommitRepo = repoCommitCounts.reduce((prev, current) =>
			current.count > prev.count ? current : prev
		);

		if (maxCommitRepo.count > 0) {
			mostCommitProject = maxCommitRepo.name;
			mostCommitProjectCount = maxCommitRepo.count;
		}
	} catch (error) {
		console.error("Error fetching commit counts:", error);
		// Fallback to most recently pushed repo
		const fallbackRepo = repos
			.filter((r) => r.pushed_at)
			.sort(
				(a, b) =>
					new Date(b.pushed_at!).getTime() - new Date(a.pushed_at!).getTime()
			)[0];
		if (fallbackRepo) {
			mostCommitProject = fallbackRepo.name;
			mostCommitProjectCount = 0;
		}
	}

	return {
		currentStreak,
		longestStreak,
		totalContributions,
		mostCommitDay,
		mostCommitDayCount,
		mostActiveDate,
		mostActiveDateCount,
		mostCommitProject,
		mostCommitProjectCount,
	};
}

function getFallbackStats(username: string): GitHubStats {
	profileViewCount++;
	return {
		username,
		fullName: username,
		bio: "Unable to fetch bio",
		totalCommits: "N/A",
		currentStreak: "N/A",
		longestStreak: "N/A",
		mostCommitDay: "N/A",
		mostCommitDayCount: 0,
		mostActiveDate: "N/A",
		mostActiveDateCount: 0,
		mostCommitProject: "N/A",
		mostCommitProjectCount: 0,
		favouriteProject: "N/A",
		favouriteProjectStars: 0,
		languages: [],
		experience: "N/A",
		totalRepos: "N/A",
		totalStars: "N/A",
		contributionsThisYear: "N/A",
		profileViews: profileViewCount.toLocaleString(),
		wakatime: undefined,
	};
}
