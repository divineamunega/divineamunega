import { Octokit } from "@octokit/rest";

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
	favouriteProject: string;
	favouriteProjectStars: number;
	languages: string[];
	experience: string;
	totalRepos: string;
	totalStars: string;
	contributionsThisYear: string;
}

interface ContributionDay {
	date: string;
	count: number;
}

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

export async function fetchGitHubStats(
	username: string
): Promise<GitHubStats> {
	try {
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
		} = calculateStreaksAndStats(contributionData, repos);

		// Calculate experience (years since account creation)
		const accountAge = new Date().getFullYear() - new Date(user.created_at!).getFullYear();
		const experience = accountAge > 0 ? `${accountAge}+ years` : "< 1 year";

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
			favouriteProject: mostStarredRepo?.name || "N/A",
			favouriteProjectStars: mostStarredRepo?.stargazers_count || 0,
			languages,
			experience,
			totalRepos: user.public_repos.toString(),
			totalStars: totalStars.toLocaleString(),
			contributionsThisYear: totalContributions.toLocaleString(),
		};
	} catch (error) {
		console.error("Error fetching GitHub stats:", error);
		// Return fallback data
		return getFallbackStats(username);
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

function calculateStreaksAndStats(
	contributions: ContributionDay[],
	repos: any[]
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
	contributions.forEach(day => {
		contributionMap.set(day.date, day.count);
	});

	// Start from yesterday and go backwards
	let checkDate = new Date(today);
	checkDate.setDate(checkDate.getDate() - 1);

	while (true) {
		const dateStr = checkDate.toISOString().split('T')[0];
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
		dayContributions[dayOfWeek] = (dayContributions[dayOfWeek] || 0) + day.count;
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

	// Find most committed project (repo with most pushes - approximation using updated repos)
	const mostCommitProject = repos.filter(r => r.pushed_at).sort((a, b) =>
		new Date(b.pushed_at!).getTime() - new Date(a.pushed_at!).getTime()
	)[0]?.name || "N/A";

	return {
		currentStreak,
		longestStreak,
		totalContributions,
		mostCommitDay,
		mostCommitDayCount,
		mostActiveDate,
		mostActiveDateCount,
		mostCommitProject,
	};
}

function getFallbackStats(username: string): GitHubStats {
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
		favouriteProject: "N/A",
		favouriteProjectStars: 0,
		languages: [],
		experience: "N/A",
		totalRepos: "N/A",
		totalStars: "N/A",
		contributionsThisYear: "N/A",
	};
}
