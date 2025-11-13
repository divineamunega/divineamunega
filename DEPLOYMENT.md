# Deployment Instructions

## Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy the project**:
   ```bash
   vercel
   ```

3. **Get your deployment URL**:
   After deployment, Vercel will provide a URL like: `https://your-project-name.vercel.app`

4. **Update README.md**:
   Replace `https://your-app-name.vercel.app/api/stats-image` with your actual Vercel deployment URL.

   Example:
   ```markdown
   ![GitHub Stats](https://divineamunega.vercel.app/api/stats-image)
   ```

5. **Set Environment Variables on Vercel**:
   In your Vercel project settings, add:
   - `GITHUB_TOKEN` - Your GitHub Personal Access Token

6. **Update the cache warming workflow**:
   Edit `.github/workflows/warm-cache.yml` and replace `your-app-name.vercel.app` with your actual Vercel URL.

7. **Commit and push all updates**:
   ```bash
   git add README.md .github/workflows/warm-cache.yml
   git commit -m "Update stats image URL with Vercel deployment"
   git push
   ```

## How It Works

- The `/api/stats-image` endpoint dynamically generates a screenshot of your stats page using Puppeteer
- Images are cached for 1 hour (3600 seconds) by CDNs
- A GitHub Action runs daily at 00:00 UTC to warm the cache (optional but recommended)
- First load takes ~15-20 seconds, subsequent loads are instant (cached)

## Cache Warming

The `.github/workflows/warm-cache.yml` workflow:
- Runs automatically every day at 00:00 UTC (midnight)
- Sends a GET request to your stats image endpoint
- Pre-generates the screenshot so it's cached when visitors view your profile
- Can be triggered manually via the "Actions" tab on GitHub

**To change the schedule**: Edit the cron expression in `warm-cache.yml`:
```yaml
# Examples:
- cron: '0 0 * * *'   # Daily at 00:00 UTC
- cron: '0 12 * * *'  # Daily at 12:00 UTC (noon)
- cron: '0 */6 * * *' # Every 6 hours
```

## Troubleshooting

If Puppeteer fails on Vercel:
- Ensure the function timeout is set to 30 seconds in `vercel.json`
- Check that Chrome/Chromium is properly installed in the serverless environment
- Puppeteer should work automatically on Vercel's platform
