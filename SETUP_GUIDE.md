# Profile Views & WakaTime Setup Guide

## Features Added

1. **Profile View Counter** - Tracks how many times your stats SVG has been loaded
2. **WakaTime Stats** - Shows your coding activity from the last 7 days

## Setup Instructions

### 1. Profile Views

The profile view counter is already set up! It uses an in-memory counter that increments each time someone loads your stats.

**Note:** The counter resets when the server restarts. For a persistent counter, consider using:
- **Vercel KV** (Redis)
- **MongoDB**
- **PostgreSQL**
- External services like [CountAPI](https://countapi.xyz/) or [hits.sh](https://hits.sh/)

### 2. WakaTime Integration

#### Step 1: Get Your WakaTime API Key

1. Go to [WakaTime Settings](https://wakatime.com/settings/account)
2. Scroll down to "API Key" section
3. Copy your secret API key

#### Step 2: Add to Environment Variables

Your `.env.local` file already has the placeholder. Replace it with your actual key:

```bash
WAKATIME_API_KEY=waka_your_actual_key_here
```

#### Step 3: Install WakaTime Plugin

Make sure you have WakaTime installed in your code editor:
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=WakaTime.vscode-wakatime)
- [JetBrains Plugin](https://plugins.jetbrains.com/plugin/7425-wakatime)
- [Other editors](https://wakatime.com/plugins)

#### Step 4: Restart Your Dev Server

```bash
# Stop your current server (Ctrl+C)
# Start it again
npm run dev
# or
pnpm dev
```

## WakaTime Stats Displayed

When configured, the SVG will show:

- **Daily Average** - Average coding hours per day (last 7 days)
- **Total Coding Time** - Total hours coded (last 7 days)
- **Best Day** - Day with most coding activity
- **Top Language** - Most used programming language with percentage
- **Editors Used** - Up to 3 editors you've used

## Testing

Visit your stats endpoint to see the changes:
- Local: `http://localhost:3000/api/stats-svg`
- Production: `https://divineamunega.vercel.app/api/stats-svg`

## Troubleshooting

### WakaTime stats not showing?

1. Verify your API key is correct in `.env.local`
2. Make sure you've been coding with WakaTime active for at least a day
3. Check the console for any WakaTime API errors
4. The stats will only show if the API key is valid (gracefully hidden otherwise)

### Profile views not increasing?

- The counter increments on every page load
- It's stored in memory, so it resets on server restart
- Consider using a database for persistence

## Making Profile Views Persistent

If you want persistent profile views, here's a quick example using Vercel KV:

```typescript
// lib/views.ts
import { kv } from '@vercel/kv';

export async function incrementViews(): Promise<number> {
  const views = await kv.incr('profile_views');
  return views;
}

export async function getViews(): Promise<number> {
  const views = await kv.get('profile_views');
  return views || 0;
}
```

Then in `lib/github.ts`, replace:
```typescript
profileViewCount++;
```

With:
```typescript
const views = await incrementViews();
```
