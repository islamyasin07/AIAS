import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { db } from "../config/firebase";

export const authRouter = Router();

authRouter.get("/me", requireAuth, async (req, res) => {
    res.json({
      uid: (req as any).uid,              
      user: (req as any).userDoc || null    
    });
  });
  
authRouter.post("/register", requireAuth, async (req, res) => {
  const uid = (req as any).uid;
  const { email, full_name, student_id, university, year_of_study, phone } = req.body;

  await db.collection("users").doc(uid).set(
    {
      email: email ?? null,
      full_name,
      student_id,
      university,
      year_of_study,
      phone,
      is_member: false,
      is_admin: false,
      membership_status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    },
    { merge: true }
  );

  res.json({ ok: true });
});
