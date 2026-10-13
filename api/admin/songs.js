import { db } from "hatchable";
export const access = "admin";
export const methods = ["GET", "POST", "DELETE"];
export default async function (req, res) {
  if (req.method === "GET") {
    const { rows } = await db.query("SELECT id, title, artist, album, cover_url, audio_url, genre, created_at FROM songs ORDER BY created_at DESC LIMIT 500");
    return res.json({ songs: rows });
  }
  if (req.method === "POST") {
    const b = req.body || {};
    const title = String(b.title || "").trim().slice(0, 180);
    const artist = String(b.artist || "").trim().slice(0, 180);
    const audio_url = String(b.audio_url || "").trim();
    if (!title || !artist || !/^https:\/\//i.test(audio_url)) return res.status(400).json({ error: "Title, artist and an HTTPS audio URL are required." });
    const { rows } = await db.query("INSERT INTO songs (title, artist, album, cover_url, audio_url, genre) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, title, artist, album, cover_url, audio_url, genre", [title, artist, String(b.album || "").slice(0,180), String(b.cover_url || "").trim(), audio_url, String(b.genre || "Pop").slice(0,60)]);
    return res.status(201).json({ song: rows[0] });
  }
  const id = String(req.body?.id || "");
  const result = await db.query("DELETE FROM songs WHERE id = $1", [id]);
  return res.json({ ok: true, deleted: result.rowCount });
}