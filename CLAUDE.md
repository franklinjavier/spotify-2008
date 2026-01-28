# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spotify 2008 is a nostalgic recreation of the original Spotify desktop client UI, built as a full-stack React Router v7 application with real Spotify API integration and playback.

## Commands

- `bun install` - Install dependencies
- `bun run dev` - Start dev server (port 3000)
- `bun run build` - Production build
- `bun run start` - Serve production build
- `bun run typecheck` - Run type generation + TypeScript check
- `bun run typegen` - Generate React Router route types
- `bun run format` - Format with Prettier
- `bun run clean` - Remove node_modules, lockfile, build artifacts

No test framework is configured.

## Architecture

**Framework:** React Router v7 in framework/SSR mode with file-based routing (`@react-router/fs-routes` flatRoutes).

**Path alias:** `~/*` maps to `./app/*`.

**Route files** live in `app/routes/` and use React Router v7 conventions. Each route exports a `loader` function for server-side data fetching and a default component. Route types are auto-generated into `.react-router/types/`.

**Services** (`app/services/`) are server-only code organized by domain:

- `auth/` - Spotify OAuth flow using the Arctic library (PKCE + state parameter)
- `session/` - Cookie-based encrypted session storage
- `spotify/` - Two API clients: `spotifyPublic` (client credentials) and `createUserSpotifyApi(accessToken)` (per-user)
- `user/` - Authenticated user retrieval from session

**Playback** uses the Spotify Web Playback SDK (client-side). State is managed via `PlayerContext`/`PlayerProvider` and the `useSpotifyPlayer` hook syncs with SDK events.

**Modules** (`app/modules/`) contain feature-specific components (album, search, new-releases) that are consumed by route files.

**Styling:** Tailwind CSS v4 with theme defined via `@theme` blocks in `app/globals.css` (no tailwind.config.js). The color palette recreates the 2008 Spotify look (dark grays, `#a0c644` lime accent).

## Code Style

Prettier is configured with: no semicolons, single quotes, trailing commas, 110 char width, 2-space tabs.
