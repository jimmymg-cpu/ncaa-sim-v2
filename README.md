# Hoops Simulator

A comprehensive, interactive basketball simulation and projection dashboard built with Next.js, React, and Tailwind CSS. The application features a premium "Console Video Game" aesthetic with dynamic probability calculations, deep game logs, and responsive design across all devices.

## Features

- **Matchup Simulator**: Select from daily slates to simulate full basketball matchups.
- **Deep Analytics**: View detailed game logs, possession-by-possession flow, and ATS (Against the Spread) / Over-Under win probabilities.
- **Console UI Aesthetic**: Features a highly polished, stylized interface with carbon-fiber textures, glowing accents, and glassmorphic panels.
- **Responsive Design**: Built to perform flawlessly on desktop, tablet, and mobile displays.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Workers (via OpenNext)
- **Data Visualization**: Recharts
- **Icons**: Lucide React

## Live Demo & Testing

Check out the fully deployed application on Cloudflare Workers here:
👉 **[https://ncaa-sim-v2.jimmymg.workers.dev](https://ncaa-sim-v2.jimmymg.workers.dev)**

**Testing Instructions:**
1. Navigate to the URL above.
2. Select a valid "Game Date" from the calendar input (e.g., today's date or +/- 1 day depending on scheduled games).
3. Choose an active matchup from the Daily Slate list on the left to load the Simulation Setup.
4. Review the dynamic Win Probabilities, ATS (Against The Spread), and Over/Under calculations.
5. Click **"SIMULATE MATCHUP"** to view real-time log-style play-by-play generation.

## Development

To run the application locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Deployment

This project uses [OpenNext](https://opennext.js.org/) for seamless deployment to Cloudflare Workers. 

To deploy:
```bash
npm run build
npm run build:worker
npx wrangler deploy --minify
```
