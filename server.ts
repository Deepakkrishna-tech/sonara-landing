import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd =
  process.env.NODE_ENV === "production" ||
  path.basename(__filename) === "server.js";
const PORT = Number(process.env.PORT) || 3000;

const DEFAULT_SHARE = "https://higgsfield.ai/s/keldUFnImRA";

function extractMp4Url(html: string): string | null {
  const og =
    html.match(
      /property=["']og:video["'][^>]*content=["']([^"']+\.mp4[^"']*)["']/i
    ) ||
    html.match(
      /content=["']([^"']+\.mp4[^"']*)["'][^>]*property=["']og:video["']/i
    );
  if (og?.[1]) return og[1];
  const mp4 = html.match(/https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/i);
  return mp4?.[0] ?? null;
}

async function createApp() {
  const app = express();

  app.get("/api/higgsfield-video", async (req, res) => {
    const shareUrl =
      typeof req.query.url === "string" && req.query.url
        ? req.query.url
        : DEFAULT_SHARE;
    try {
      const response = await fetch(shareUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SonaraBot/1.0)" },
      });
      if (!response.ok) {
        res.status(502).json({ success: false, error: "Upstream fetch failed" });
        return;
      }
      const html = await response.text();
      const url = extractMp4Url(html);
      if (!url) {
        res.status(404).json({ success: false, error: "No MP4 URL found" });
        return;
      }
      res.json({ success: true, url });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const dist = __dirname;
    app.use(express.static(dist));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Sonara listening on http://localhost:${PORT}`);
  });
}

createApp().catch((err) => {
  console.error(err);
  process.exit(1);
});
