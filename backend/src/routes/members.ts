import { Router } from "express";
import { db } from "../config/firebase";
import { requireAuth } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAdmin";

export const membersRouter = Router();
membersRouter.use(requireAuth, requireAdmin);
membersRouter.get("/", async (req, res) => {
  const { status, q } = req.query as any;
  let ref: FirebaseFirestore.Query = db.collection("users");
  if (status) ref = ref.where("membership_status", "==", status);
  const snap = await ref.get();
  const data = snap.docs
    .map(d => ({ id: d.id, ...(d.data() as any) }))
    .filter(u => !q || (u.full_name || "").toLowerCase().includes(String(q).toLowerCase()));
  res.json({ data });
});

membersRouter.post("/:id/approve", async (req, res) => {
  await db.collection("users").doc(req.params.id).update({
    membership_status: "approved",
    is_member: true,
    updated_at: new Date(),
  });
  res.json({ ok: true });
});

membersRouter.post("/:id/reject", async (req, res) => {
  await db.collection("users").doc(req.params.id).update({
    membership_status: "rejected",
    is_member: false,
    updated_at: new Date(),
  });
  res.json({ ok: true });
});

membersRouter.delete("/:id", async (req, res) => {
  await db.collection("users").doc(req.params.id).delete();
  res.json({ ok: true });
});
