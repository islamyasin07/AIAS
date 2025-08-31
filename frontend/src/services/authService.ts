
import { api } from "./api";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import "../config/firebaseClient"; 

const LS_TOKEN = "aias_token";
const LS_USER  = "aias_user";

export const getToken = () => localStorage.getItem(LS_TOKEN);
export const setToken = (t: string) => localStorage.setItem(LS_TOKEN, t);
export const clearToken = () => localStorage.removeItem(LS_TOKEN);

export const getStoredUser = () => {
  const v = localStorage.getItem(LS_USER);
  return v ? JSON.parse(v) : null;
};
export const setStoredUser = (u: any) => localStorage.setItem(LS_USER, JSON.stringify(u));

export async function loginWithEmailPassword(email: string, password: string) {
  const auth = getAuth();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await cred.user.getIdToken(true); 
  const meRes = await api.get("/auth/me", {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  const user = meRes.data?.user ?? meRes.data ?? { uid: cred.user.uid, email: cred.user.email };
  return { token: idToken, user };
}


export async function registerWithEmailPassword(payload: {
  email: string; password: string; full_name?: string;
}) {


  const { email, password } = payload;
  return loginWithEmailPassword(email, password);
}

export async function logoutClient() {
  const auth = getAuth();
  await signOut(auth);
  clearToken();
  localStorage.removeItem(LS_USER);
}
