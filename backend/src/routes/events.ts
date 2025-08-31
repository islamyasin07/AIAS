import { Router } from "express";
import { db, FieldValue } from "../config/firebase";
import { requireAuth } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAdmin";

export const eventsRouter = Router();

// Public list
eventsRouter.get("/", async (req, res) => {
  const { status } = req.query as any;
  let ref: FirebaseFirestore.Query = db.collection("events");
  if (status) ref = ref.where("status", "==", String(status)); // published | full | ...
  const snap = await ref.get();
  const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  res.json({ data });
});

// Admin: create/update
eventsRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, description, date, location, capacity, registration_deadline, status, requirements } = req.body;
  const doc = await db.collection("events").add({
    title,
    description: description ?? "",
    date: date ? new Date(date) : null,
    location,
    capacity: Number(capacity ?? 0),
    registered_count: 0,
    registration_deadline: registration_deadline ? new Date(registration_deadline) : null,
    status: status ?? "draft",
    requirements: requirements ?? "",
    created_by: (req as any).uid,
    created_at: new Date(),
    updated_at: new Date(),
  });
  res.json({ id: doc.id });
});

eventsRouter.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id;
  await db.collection("events").doc(id).update({
    ...req.body,
    updated_at: FieldValue.serverTimestamp(),
  });
  res.json({ ok: true });
});

eventsRouter.get("/:id/registrations", requireAuth, requireAdmin, async (req, res) => {
  const eventId = req.params.id;
  const snap = await db.collection("event_registrations").where("event_id","==",eventId).get();
  const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  res.json({ data });
});

eventsRouter.post("/:id/register", requireAuth, async (req, res) => {
  const eventId = req.params.id;
  const uid = (req as any).uid;

  await db.runTransaction(async tx => {
    const eventRef = db.collection("events").doc(eventId);
    const evSnap = await tx.get(eventRef);
    if (!evSnap.exists) throw new Error("EVENT_NOT_FOUND");
    const ev = evSnap.data() as any;

    if (ev.status !== "published") throw new Error("EVENT_NOT_OPEN");

    // already registered?
    const already = await db.collection("event_registrations")
      .where("event_id","==",eventId).where("user_id","==",uid).limit(1).get();
    if (!already.empty) throw new Error("ALREADY_REGISTERED");

    const accepted = (ev.registered_count || 0) < (ev.capacity || 0);
    const status = accepted ? "accepted" : "waitlist";

    const regRef = db.collection("event_registrations").doc();
    tx.set(regRef, {
      event_id: eventId,
      user_id: uid,
      status,
      registered_at: FieldValue.serverTimestamp(),
      notes: "",
      notification_sent: false
    });

    if (accepted) {
      tx.update(eventRef, {
        registered_count: FieldValue.increment(1),
        status: (ev.registered_count + 1 >= ev.capacity) ? "full" : ev.status
      });
    }
  });

  res.json({ ok: true });
});
eventsRouter.post("/registrations/:id/accept", requireAuth, requireAdmin, async (req, res) => {
  const regId = req.params.id;
  const ref = db.collection("event_registrations").doc(regId);
  const reg = await ref.get();
  if (!reg.exists) return res.status(404).json({ error: "REG_NOT_FOUND" });
  const r = reg.data() as any;

  const eventRef = db.collection("events").doc(r.event_id);
  await db.runTransaction(async tx => {
    const evSnap = await tx.get(eventRef);
    if (!evSnap.exists) throw new Error("EVENT_NOT_FOUND");
    const ev = evSnap.data() as any;

    if ((ev.registered_count || 0) >= (ev.capacity || 0)) {
      return; // You can't register (FULL)
    }

    tx.update(ref, { status: "accepted" });
    tx.update(eventRef, {
      registered_count: FieldValue.increment(1),
      status: (ev.registered_count + 1 >= ev.capacity) ? "full" : ev.status
    });
  });

  res.json({ ok: true });
});
