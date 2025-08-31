import { Router } from "express";
import { db, FieldValue } from "../config/firebase";
import { requireAuth } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAdmin";

export const resourcesRouter = Router();

// Public list
resourcesRouter.get("/", async (req, res) => {
  const { category, type, q } = req.query as any;
  let ref: FirebaseFirestore.Query = db.collection("resources");
  if (category) ref = ref.where("category", "==", String(category));
  if (type) ref = ref.where("type", "==", String(type));
  const snap = await ref.get();
  let data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  if (q) {
    const s = String(q).toLowerCase();
    data = data.filter(r => (r.title || "").toLowerCase().includes(s));
  }
  res.json({ data });
});


resourcesRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, description, type, url, thumbnail_url, category, tags, is_active } = req.body;
  const doc = await db.collection("resources").add({
    title,
    description: description ?? "",
    type, 
    url,
    thumbnail_url: thumbnail_url ?? "",
    category,
    tags: Array.isArray(tags) ? tags : [],
    is_active: is_active ?? true,
    created_by: (req as any).uid,
    created_at: new Date(),
    updated_at: new Date(),
  });
  res.json({ id: doc.id });
});


resourcesRouter.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id;
  await db.collection("resources").doc(id).update({
    ...req.body,
    updated_at: FieldValue.serverTimestamp(),
  });
  res.json({ ok: true });
});


resourcesRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await db.collection("resources").doc(req.params.id).delete();
  res.json({ ok: true });
});
