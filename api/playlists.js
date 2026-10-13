import { db, auth } from "hatchable";
export const access = "public";
export const methods = ["GET", "POST", "DELETE"];
export default async function (req, res) {
  const user = await auth.getUser(req);
  if (!user) return res.status(401).json({ error: "Sign in required" });
  if (req.method === "GET") {
    const { rows } = await db.query("SELECT id, name, created_at FROM playlists WHERE user_id = $1 ORDER BY created_at DESC", [user.id]);
    return res.json({ playlists: rows });
  }
  if (req.method === "POST") {
    const name = String(req.body?.name || "").trim().slice(0, 80);
    if (!name) return res.status(400).json({ error: "Playlist name is required" });
    const { rows } = await db.query("INSERT INTO playlists (user_id, name) VALUES ($1, $2) RETURNING id, name, created_at", [user.id, name]);
    return res.status(201).json({ playlist: rows[0] });
  }
  const id = String(req.body?.id || "");
  const result = await db.query("DELETE FROM playlists WHERE id = $1 AND user_id = $2", [id, user.id]);
  return res.json({ ok: true, deleted: result.rowCount });
}