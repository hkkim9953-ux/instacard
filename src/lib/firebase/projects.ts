import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getDb, getFirebaseAuth } from "@/lib/firebase/client";
import type { ProjectDoc, ProjectSaveBody } from "@/lib/projects";

function tsToIso(value: unknown): string {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as Timestamp).toDate === "function"
  ) {
    return (value as Timestamp).toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

/** Auth 초기화 대기 후 현재 유저 (없으면 null) */
export function waitForUser(timeoutMs = 8000): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) return Promise.resolve(auth.currentUser);

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      unsub();
      resolve(auth.currentUser);
    }, timeoutMs);
    const unsub = onAuthStateChanged(auth, (user) => {
      clearTimeout(timer);
      unsub();
      resolve(user);
    });
  });
}

export async function requireUser() {
  const user = await waitForUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  return user;
}

export async function listProjectsClient(): Promise<ProjectDoc[]> {
  const user = await requireUser();
  const q = query(
    collection(getDb(), "projects"),
    where("userId", "==", user.uid),
    orderBy("updatedAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId as string,
      title: data.title as string,
      themeId: (data.themeId as string) || "minimal-light",
      themeConfig: (data.themeConfig as Record<string, unknown>) || {},
      slides: (data.slides as ProjectDoc["slides"]) || [],
      captionText: (data.captionText as string) ?? null,
      hashtags: (data.hashtags as string[]) || [],
      sourceText: (data.sourceText as string) ?? null,
      createdAt: tsToIso(data.createdAt),
      updatedAt: tsToIso(data.updatedAt),
    };
  });
}

export async function getProjectClient(id: string): Promise<ProjectDoc | null> {
  const user = await requireUser();
  const ref = doc(getDb(), "projects", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.userId !== user.uid) return null;
  return {
    id: snap.id,
    userId: data.userId as string,
    title: data.title as string,
    themeId: (data.themeId as string) || "minimal-light",
    themeConfig: (data.themeConfig as Record<string, unknown>) || {},
    slides: (data.slides as ProjectDoc["slides"]) || [],
    captionText: (data.captionText as string) ?? null,
    hashtags: (data.hashtags as string[]) || [],
    sourceText: (data.sourceText as string) ?? null,
    createdAt: tsToIso(data.createdAt),
    updatedAt: tsToIso(data.updatedAt),
  };
}

export async function saveProjectClient(body: ProjectSaveBody) {
  const user = await requireUser();
  const db = getDb();
  const payload = {
    userId: user.uid,
    title: body.title.trim(),
    themeId: body.themeId || "minimal-light",
    themeConfig: {
      themeId: body.themeId,
      ...(body.bgImage ? { bgImage: body.bgImage } : {}),
      ...(body.mood?.trim() ? { mood: body.mood.trim() } : {}),
      ...(body.details?.trim() ? { details: body.details.trim() } : {}),
    },
    slides: body.slides,
    captionText: body.caption ?? null,
    hashtags: body.hashtags ?? [],
    sourceText: body.sourceText ?? null,
    updatedAt: serverTimestamp(),
  };

  if (body.id) {
    const ref = doc(db, "projects", body.id);
    const existing = await getDoc(ref);
    if (!existing.exists() || existing.data().userId !== user.uid) {
      throw new Error("프로젝트를 찾을 수 없습니다.");
    }
    await updateDoc(ref, payload);
    return { id: body.id, title: payload.title };
  }

  const created = await addDoc(collection(db, "projects"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return { id: created.id, title: payload.title };
}

export async function deleteProjectClient(id: string) {
  const user = await requireUser();
  const ref = doc(getDb(), "projects", id);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().userId !== user.uid) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }
  await deleteDoc(ref);
}

export async function getIdTokenHeader(): Promise<HeadersInit> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("로그인이 필요합니다.");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}
