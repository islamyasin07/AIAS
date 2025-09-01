import { Router } from "express";
import { db } from "../config/firebase";
import { requireAuth } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAdmin";

export const resourcesRouter = Router();
resourcesRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, description, type, url, category, tags } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    const ref = await db.collection("resources").add({
      title,
      description,
      type: type || "link", 
      url,
      category: category || null,
      tags: tags || [],
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.json({ ok: true, id: ref.id });
  } catch (err: any) {
    console.error("Create resource error:", err.message);
    res.status(500).json({ error: "Failed to create resource" });
  }
});


resourcesRouter.get("/", requireAuth, async (req, res) => {
  try {
    const { type, category, q } = req.query as any;

    let ref: FirebaseFirestore.Query = db.collection("resources").where("is_active", "==", true);

    if (type && type !== "all") {
      ref = ref.where("type", "==", type);
    }
    if (category && category !== "All") {
      ref = ref.where("category", "==", category);
    }

    const snap = await ref.get();
    let items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    if (q) {
      const qLower = String(q).toLowerCase();
      items = items.filter((r) => (r.title || "").toLowerCase().includes(qLower));
    }

    res.json({ items });
  } catch (err: any) {
    console.error("List resources error:", err.message);
    res.status(500).json({ error: "Failed to list resources" });
  }
});


resourcesRouter.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("resources").doc(id).update({
      ...req.body,
      updated_at: new Date(),
    });
    res.json({ ok: true });
  } catch (err: any) {
    console.error("Update resource error:", err.message);
    res.status(500).json({ error: "Failed to update resource" });
  }
});


resourcesRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("resources").doc(id).delete();
    res.json({ ok: true });
  } catch (err: any) {
    console.error("Delete resource error:", err.message);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});
