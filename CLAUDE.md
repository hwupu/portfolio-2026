# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio and blog site for a front-end developer with background in Computer Science, Graphic Design, Industrial Design, and factory management. Built with Astro 5 and deployed on Cloudflare Workers for SSR with strict CSP (nonce-based).

### Site Goals
- Minimal, WCAG-compliant design
- Modern image formats (AVIF with WEBP fallback, no PNG/GIF/JPEG)
- Internationalization (i18n) support
- SEO and AI agent optimization (Schema.org JSON-LD)
- Strict Content Security Policy with nonces
- Blog functionality with content collections

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

## Content Strategy

### Portfolio Sections
- **About**: CS major with front-end dev, graphic design, industrial design, and factory management experience
- **Projects**: Featured work with case studies
- **Blog**: Technical articles and insights
- **Design Work**: Graphic and industrial design portfolio
- **Contact**: Professional contact information

### Content Collections
- Blog posts (Markdown/MDX with frontmatter)
- Projects (case studies with images)
- Design work (portfolio pieces)

## Security & Performance

### Content Security Policy
- Strict CSP with nonce-based script/style allowlisting
- Configure CSP headers in Cloudflare Worker middleware
- Use Astro's built-in CSP nonce support for inline scripts/styles

### Image Optimization
- Primary format: AVIF
- Fallback format: WEBP
- Use `<picture>` element with source sets
- Leverage Cloudflare Image Optimization
- No legacy formats (PNG/GIF/JPEG)

### Accessibility (WCAG)
- Semantic HTML5 elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance (WCAG AA minimum)
- Screen reader testing
- Focus management

### SEO & AI Optimization
- Schema.org JSON-LD structured data (Person, WebSite, BlogPosting, etc.)
- Open Graph tags for social sharing
- Semantic HTML for better content understanding
- RSS feed for blog
- Sitemap generation
- Robots.txt configuration

### Internationalization
- Astro i18n routing support
- Language switcher component
- Content translation strategy (initial: English, expandable)
- `lang` attribute on HTML element
- hreflang tags for alternate languages

## Domain Configuration

### Production Domain
- **Primary domain**: `phwu.dev` (canonical)
- **WWW redirect**: `www.phwu.dev` → `phwu.dev` (301 redirect via middleware)

### Setting Up Custom Domain
1. **Via Cloudflare Dashboard** (Recommended):
   - Go to Workers & Pages → portfolio-2026
   - Navigate to Settings → Domains & Routes → Custom Domains
   - Add `phwu.dev` and `www.phwu.dev`
   - Cloudflare automatically creates DNS records and SSL certificates

2. **Via wrangler.jsonc**:
   - Routes are already configured in `wrangler.jsonc`
   - Deploy with `pnpm deploy` to apply changes

### DNS Records (Auto-created by Cloudflare)
- `phwu.dev` → CNAME or A/AAAA to Workers
- `www.phwu.dev` → CNAME or A/AAAA to Workers

## Development Workflow

### Documentation Resources
- **Astro Framework**: Use the Astro docs MCP server for all Astro-related questions, APIs, features, and configuration
- **Other Frameworks/Libraries**: Use Context7 MCP tools to resolve library IDs and get documentation for non-Astro dependencies

Always automatically use the appropriate documentation tools without needing explicit requests.
