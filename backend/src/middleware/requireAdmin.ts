import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).userDoc;
 // if (!user?.is_admin) {
    //return res.status(403).json({ error: { code: "FORBIDDEN", message: "Admin only" } });
 // }
  next();
}
