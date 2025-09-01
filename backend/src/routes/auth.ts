import { Router } from "express";
import admin from "firebase-admin";
import { db } from "../config/firebase";

export const authRouter = Router();

                 
authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

              const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: full_name,
    });

    const photoURL =
      "https://m.media-amazon.com/images/I/41hN+xkymjL._UXNaN_FMjpg_QL85_.jpg" +
      encodeURIComponent(full_name || email) +
      "&background=random&rounded=true";

    await db.collection("users").doc(userRecord.uid).set({
      email,
      full_name,
      photoURL,
      is_admin: false,
      membership_status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.json({ ok: true, uid: userRecord.uid });
  } catch (err: any) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "Missing idToken" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const doc = await db.collection("users").doc(decoded.uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      token: idToken,
      user: { uid: decoded.uid, ...doc.data() },
    });
  } catch (err: any) {
    console.error("Login error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
});

authRouter.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing Authorization" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const doc = await db.collection("users").doc(decoded.uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: { uid: decoded.uid, ...doc.data() } });
  } catch (err: any) {
    res.status(401).json({ error: "Unauthorized" });
  }
});
