# AGENTS.md — Sonara Landing

- Edit `index.html` / `server.ts` in place. No React.
- Keep GSAP scrub `!video.seeking` guard; map scroll progress directly to `currentTime` (no lerp).
- Hero/reveal use scrub-encoded MP4s in `public/videos/*-scrub.mp4` (short GOP, faststart). CloudFront URLs are fallbacks only.
- Accent `#C5A572`. Brand: Sonara.
- `npm run dev` on port 3000.