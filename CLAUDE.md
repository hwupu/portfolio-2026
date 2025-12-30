# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based portfolio site configured to deploy on Cloudflare Workers. The project uses Astro 5 with the Cloudflare adapter for edge deployment.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (localhost:4321)
pnpm dev

# Build for production
pnpm build

# Preview build locally with Cloudflare Workers simulation
pnpm preview

# Deploy to Cloudflare
pnpm deploy

# Generate TypeScript types for Cloudflare Workers
pnpm cf-typegen
```

## Architecture

### Deployment Platform
- **Runtime**: Cloudflare Workers (edge runtime)
- **Adapter**: `@astrojs/cloudflare` with platform proxy enabled
- **Image Service**: Cloudflare image optimization

### Cloudflare Configuration
- Main worker file: `./dist/_worker.js/index.js`
- Assets binding: `ASSETS` (serves static files from `./dist`)
- Compatibility flags: `nodejs_compat`, `global_fetch_strictly_public`
- Observability enabled for monitoring

### TypeScript Configuration
- Extends `astro/tsconfigs/strict`
- Custom worker types: `worker-configuration.d.ts` (auto-generated via `wrangler types`)
- Environment types available via `Cloudflare.Env` interface

### Project Structure
- `src/pages/` - File-based routing (each `.astro` or `.md` file becomes a route)
- `public/` - Static assets (served as-is)
- `dist/` - Build output directory (excluded from TypeScript)

## Cloudflare Workers Context

When working with server-side code in Astro pages or API routes:
- Access Cloudflare bindings via `Astro.locals.runtime.env`
- The `ASSETS` binding is available for fetching static assets
- Environment variables and bindings are typed in `worker-configuration.d.ts`
- Use `wrangler.jsonc` to configure additional bindings (KV, D1, R2, etc.)

## Adding Cloudflare Bindings

To add new bindings (KV, D1, R2, etc.):
1. Update `wrangler.jsonc` with the binding configuration
2. Run `pnpm cf-typegen` to regenerate TypeScript types
3. Access bindings via `Astro.locals.runtime.env.BINDING_NAME`

## Development Workflow

Always use Context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.
