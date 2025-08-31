// src/middleware/requireAuth.ts
import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { db } from "../config/firebase"; 

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "NO_TOKEN" });
    }

    const idToken = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    (req as any).uid = decoded.uid;
    const snap = await db.collection("users").doc(decoded.uid).get();
    const userDoc = snap.exists ? snap.data() : null;

    (req as any).userDoc = userDoc; 
    (req as any).user = decoded;    

    next();
  } catch (e: any) {
    console.error("Auth error:", e.message);
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}
