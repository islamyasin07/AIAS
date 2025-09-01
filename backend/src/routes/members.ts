import { Router } from "express";
import { db } from "../config/firebase";
import { requireAuth } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAdmin";

export const membersRouter = Router();

membersRouter.post("/register", requireAuth, async (req, res) => {
  try {
    const { email, full_name, student_id, university, year_of_study, phone } = req.body;

    if (!email || !full_name || !student_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ref = await db.collection("users").add({
      email,
      full_name,
      student_id,
      university,
      year_of_study,
      phone,
      is_member: false,
      membership_status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.json({ ok: true, id: ref.id });
  } catch (err: any) {
    console.error("Register member error:", err.message);
    res.status(500).json({ error: "Failed to register member" });
  }
});

membersRouter.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query: FirebaseFirestore.Query = db.collection("users");

    if (status && status !== "all") {
      query = query.where("membership_status", "==", status);
    }

    const snap = await query.get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ items });
  } catch (err: any) {
    console.error("List members error:", err.message);
    res.status(500).json({ error: "Failed to load members" });
  }
});

membersRouter.post("/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).update({
      membership_status: "approved",
      is_member: true,
      updated_at: new Date(),
    });
    res.json({ ok: true });
  } catch (err: any) {
    console.error("Approve member error:", err.message);
    res.status(500).json({ error: "Failed to approve member" });
  }
});

membersRouter.post("/:id/reject", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).update({
      membership_status: "rejected",
      is_member: false,
      updated_at: new Date(),
    });
    res.json({ ok: true });
  } catch (err: any) {
    console.error("Reject member error:", err.message);
    res.status(500).json({ error: "Failed to reject member" });
  }
});

membersRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    res.json({ ok: true });
  } catch (err: any) {
    console.error("Delete member error:", err.message);
    res.status(500).json({ error: "Failed to delete member" });
  }
});

membersRouter.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing member id" });

    await db.collection("users").doc(id).update({
      ...req.body,
      updated_at: new Date(),
    });

    res.json({ ok: true });
  } catch (err: any) {
    console.error("Patch member error:", err.message);
    res.status(500).json({ error: "Failed to patch member" });
  }
});

membersRouter.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing member id" });

    await db.collection("users").doc(id).set({
      ...req.body,
      updated_at: new Date(),
    });

    res.json({ ok: true });
  } catch (err: any) {
    console.error("Put member error:", err.message);
    res.status(500).json({ error: "Failed to put member" });
  }
});
