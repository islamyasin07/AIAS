import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export interface AuthedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;
    next();
  } catch (err: any) {
    console.error("requireAuth error:", err.message);
    res.status(401).json({ error: "Unauthorized" });
  }
}
