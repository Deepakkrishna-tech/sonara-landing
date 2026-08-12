# AGENTS.md — Sonara Landing

- Edit `index.html` / `server.ts` in place. No React.
- Keep GSAP scrub `!video.seeking` and `readyState >= 2` guards; map scroll progress directly to `currentTime` (no lerp).
- Mobile (≤768px): muted loop playback; desktop: scroll-scrub. Local `/videos/*` with CloudFront fallback in `bindVideoSrc`.
- Accent `#C5A572`. Brand: Sonara.
- `npm run dev` on port 3000.