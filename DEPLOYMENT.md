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

6. **Commit and push the README update**:
   ```bash
   git add README.md
   git commit -m "Update stats image URL with Vercel deployment"
   git push
   ```

## How It Works

- The `/api/stats-image` endpoint dynamically generates a screenshot of your stats page using Puppeteer
- Images are cached for 1 hour (3600 seconds) by CDNs
- No GitHub Actions needed - the image is generated on-demand
- First load takes ~15-20 seconds, subsequent loads are instant (cached)

## Troubleshooting

If Puppeteer fails on Vercel:
- Ensure the function timeout is set to 30 seconds in `vercel.json`
- Check that Chrome/Chromium is properly installed in the serverless environment
- Puppeteer should work automatically on Vercel's platform
