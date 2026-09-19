import fs from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use GET." });
  }

  try {
    const heroDir = path.join(process.cwd(), "images", "hero");
    if (fs.existsSync(heroDir)) {
      const files = fs.readdirSync(heroDir);
      const validExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);
      const images = files
        .filter(f => validExtensions.has(path.extname(f).toLowerCase()))
        .sort()
        .map(f => `/images/hero/${encodeURIComponent(f)}`);
      return res.status(200).json({ success: true, images });
    }
    return res.status(200).json({ success: true, images: [] });
  } catch (err: any) {
    console.warn("[HERO IMAGES API] Error reading hero images:", err);
    return res.status(500).json({ success: false, error: err?.message || "Failed to load hero images" });
  }
}
