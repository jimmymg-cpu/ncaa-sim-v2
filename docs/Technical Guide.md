# NCAASIM26 Technical Guide

This document outlines the architecture, technology stack, and complex deployment processes involved in building the NCAA Basketball Simulator 2026.

## Architecture & Tech Stack

*   **Frontend Framework**: Next.js 15 (App Router)
*   **UI Library**: React 19
*   **Styling**: Tailwind CSS v4
*   **Data Visualization**: Recharts
*   **Deployment Infrastructure**: Cloudflare Workers (Edge Computing)
*   **Serverless Adapter**: OpenNext

## Code Organization

The project was migrated from a legacy Vite/Express structure to a modern Next.js monolith:

*   **`app/page.tsx`**: The primary Client Component entry point. It hosts the React application and manages the global state machine (Daily Slate selection, Simulation triggering).
*   **`app/layout.tsx`**: The Root Layout defining the global HTML structure, embedding standard fonts (Inter, Bebas Neue, Teko), and importing global CSS.
*   **`app/api/health/route.ts`**: An example backend API route handler ported from Express.
*   **`App.tsx` & `components/`**: The core interactive UI components rendering the "Console Video Game" aesthetic using deep glassmorphism and Tailwind utility classes.
*   **`tailwind.config.js`**: Defines the custom design system, including `console-gold`, `console-blue`, `console-red`, and font families.

## The Deployment Pipeline (Cloudflare & OpenNext)

Deploying a complex Next.js 15 application natively to Cloudflare Workers requires `@opennextjs/cloudflare`.

### The Build Process

1.  **`npm run build`**: Triggers the standard Next.js compiler (Turbopack). This statically analyzes the `app/` directory, compiles React components, and prepares the `.next` cache.
2.  **`npm run build:worker`**: Invokes the OpenNext Cloudflare adapter. It reads the `.next` output and generates a single Cloudflare Worker script (`.open-next/worker.js`) capable of SSR and routing.
3.  **`npx wrangler deploy`**: Uses Cloudflare's CLI to upload the code and bind necessary resources.

### Critical Environmental Configurations

#### Static Asset Routing (`wrangler.toml`)
To ensure CSS and JS chunks are correctly served to the browser, the project avoids legacy Workers Sites and instead utilizes the native `assets` binding:
```toml
name = "ncaa-sim-v2"
main = ".open-next/worker.js"
compatibility_date = "2026-02-01"
compatibility_flags = ["nodejs_compat"]

assets = { directory = ".open-next/assets", binding = "ASSETS" }
```

#### Bypassing Windows WebAssembly Limitations
OpenNext dynamically imports binary WebAssembly modules (`resvg.wasm`, `yoga.wasm`) for Next.js Image Optimization. On local Windows development environments, the required `?module` query parameter creates invalid file paths, crashing local Cloudflare simulative loops. 
*   **Resolution**: These modules are statically ignored or patched out of the routing logic within `.open-next/server-functions/default/open-next.config.mjs` for edge compatibility.

#### Resolving Tailwind v4 Infinite Cache Deadlocks
Tailwind CSS v4 introduces heuristic whole-project scanning for CSS classes. 
*   **The Bug**: If a Next.js build error occurs and dumps an unescaped CSS string (like a malformed background URL) into a root `.log` file, Tailwind will continuously parse this log file and re-inject the broken syntax back into the Webpack compilation process. This triggers a permanent 500 Server Error route crash that persists even if `app/globals.css` is corrected.
*   **The Solution**: A robust `.gitignore` must be employed to hide environment artifacts and binary caches from the compiler:
    ```gitignore
    # .gitignore
    .wrangler/
    .open-next/
    *.log
    *.txt
    ```
