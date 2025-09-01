import { Response, NextFunction } from "express";
import { AuthedRequest } from "./requireAuth";
import { db } from "../config/firebase";

export async function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const doc = await db.collection("users").doc(req.user.uid).get();
    if (!doc.exists) {
      return res.status(403).json({ error: "User not found" });
    }

    const userData = doc.data();
    if (!userData?.is_admin) {
      return res.status(403).json({ error: "Admin only" });
    }

    (req as any).userData = userData; 
    next();
  } catch (err: any) {
    console.error("requireAdmin error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}
