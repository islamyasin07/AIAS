import { Router } from "express";
import { db } from "../config/firebase";
import { requireAuth, AuthedRequest } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAdmin";

export const eventsRouter = Router();

eventsRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, description, date, location, capacity, registration_deadline, requirements } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ref = await db.collection("events").add({
      title,
      description,
      date: new Date(date),
      location,
      capacity,
      registered_count: 0,
      registration_deadline: registration_deadline ? new Date(registration_deadline) : null,
      status: "published",
      requirements,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.json({ ok: true, id: ref.id });
  } catch (err: any) {
    console.error("Create event error:", err.message);
    res.status(500).json({ error: "Failed to create event" });
  }
});


eventsRouter.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("events").doc(id).update({
      ...req.body,
      updated_at: new Date(),
    });
    res.json({ ok: true });
  } catch (err: any) {
    console.error("Update event error:", err.message);
    res.status(500).json({ error: "Failed to update event" });
  }
});


eventsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const snap = await db.collection("events").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ items });
  } catch (err: any) {
    console.error("List events error:", err.message);
    res.status(500).json({ error: "Failed to list events" });
  }
});

eventsRouter.post("/:id/register", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const eventRef = db.collection("events").doc(id);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) return res.status(404).json({ error: "Event not found" });

    const event = eventSnap.data() as any;

    if (event.capacity && event.registered_count >= event.capacity) {
      return res.status(400).json({ error: "Event full" });
    }

    await db.collection("event_registrations").add({
      event_id: id,
      user_id: userId,
      status: "pending",
      registered_at: new Date(),
    });
    await eventRef.update({
      registered_count: (event.registered_count || 0) + 1,
    });

    res.json({ ok: true });
  } catch (err: any) {
    console.error("Register event error:", err.message);
    res.status(500).json({ error: "Failed to register for event" });
  }
});

eventsRouter.get("/:id/registrations", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const snap = await db.collection("event_registrations").where("event_id", "==", id).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ items });
  } catch (err: any) {
    console.error("List registrations error:", err.message);
    res.status(500).json({ error: "Failed to list registrations" });
  }
});

eventsRouter.post("/registrations/:id/accept", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("event_registrations").doc(id).update({
      status: "accepted",
    });
    res.json({ ok: true });
  } catch (err: any) {
    console.error("Accept registration error:", err.message);
    res.status(500).json({ error: "Failed to accept registration" });
  }
});

eventsRouter.post("/registrations/:id/reject", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("event_registrations").doc(id).update({
      status: "rejected",
    });
    res.json({ ok: true });
  } catch (err: any) {
    console.error("Reject registration error:", err.message);
    res.status(500).json({ error: "Failed to reject registration" });
  }


  
});
