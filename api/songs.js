import { db } from "hatchable";
export const access = "public";
export const methods = ["GET"];
export default async function (req, res) {
  const q = String(req.query.q || "").trim();
  const { rows } = await db.query("SELECT id, title, artist, album, cover_url, audio_url, genre FROM songs WHERE ($1 = '' OR title ILIKE $2 OR artist ILIKE $2 OR genre ILIKE $2) ORDER BY created_at DESC LIMIT 200", [q, "%" + q + "%"]);
  res.json({ songs: rows });
}