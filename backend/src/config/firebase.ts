import admin from "firebase-admin";
import fs from "fs";
import path from "path";
function loadServiceAccount() {
  const p = process.env.FIREBASE_SA_PATH || "serviceAccount.json";
  const abs = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
  const raw = fs.readFileSync(abs, "utf-8");
  return JSON.parse(raw);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(loadServiceAccount() as admin.ServiceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();

export const FieldValue = admin.firestore.FieldValue;
