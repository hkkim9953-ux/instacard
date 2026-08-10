import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  addDoc,
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

function mapProject(id: string, data: Record<string, unknown>): ProjectDoc {
  const imageCount =
    typeof data.imageCount === "number"
      ? data.imageCount
      : Array.isArray(data.slideImages)
        ? (data.slideImages as unknown[]).length
        : 0;
  return {
    id,
    userId: data.userId as string,
    title: data.title as string,
    themeId: (data.themeId as string) || "minimal-light",
    themeConfig: (data.themeConfig as Record<string, unknown>) || {},
    slides: (data.slides as ProjectDoc["slides"]) || [],
    imageCount,
    coverThumb: (data.coverThumb as string) ?? null,
    captionText: (data.captionText as string) ?? null,
    hashtags: (data.hashtags as string[]) || [],
    sourceText: (data.sourceText as string) ?? null,
    createdAt: tsToIso(data.createdAt),
    updatedAt: tsToIso(data.updatedAt),
  };
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
  return snap.docs.map((d) => mapProject(d.id, d.data() as Record<string, unknown>));
}

export async function getProjectClient(id: string): Promise<ProjectDoc | null> {
  const user = await requireUser();
  const refDoc = doc(getDb(), "projects", id);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) return null;
  const data = snap.data() as Record<string, unknown>;
  if (data.userId !== user.uid) return null;
  return mapProject(snap.id, data);
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
    },
    slides: body.slides,
    ...(body.imageCount !== undefined ? { imageCount: body.imageCount } : {}),
    ...(body.coverThumb !== undefined ? { coverThumb: body.coverThumb } : {}),
    captionText: body.caption ?? null,
    hashtags: body.hashtags ?? [],
    sourceText: body.sourceText ?? null,
    updatedAt: serverTimestamp(),
  };

  if (body.id) {
    const refDoc = doc(db, "projects", body.id);
    const existing = await getDoc(refDoc);
    if (!existing.exists() || existing.data().userId !== user.uid) {
      throw new Error("프로젝트를 찾을 수 없습니다.");
    }
    await updateDoc(refDoc, payload);
    return { id: body.id, title: payload.title, userId: user.uid };
  }

  const created = await addDoc(collection(db, "projects"), {
    ...payload,
    imageCount: body.imageCount ?? 0,
    coverThumb: body.coverThumb ?? null,
    createdAt: serverTimestamp(),
  });
  return { id: created.id, title: payload.title, userId: user.uid };
}

async function clearProjectImages(projectId: string) {
  const db = getDb();
  const snap = await getDocs(collection(db, "projects", projectId, "images"));
  if (snap.empty) return;
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

async function blobToJpegDataUrl(blob: Blob, maxW = 1080, quality = 0.72) {
  const bmp = await createImageBitmap(blob);
  const scale = Math.min(1, maxW / bmp.width);
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bmp.close();
    throw new Error("이미지 변환 실패");
  }
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  return canvas.toDataURL("image/jpeg", quality);
}

/** 카드 이미지를 projects/{id}/images 에 저장 */
export async function uploadProjectSlideImages(
  _userId: string,
  projectId: string,
  blobs: Blob[],
): Promise<number> {
  const user = await requireUser();
  const db = getDb();
  const parent = await getDoc(doc(db, "projects", projectId));
  if (!parent.exists() || parent.data().userId !== user.uid) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }

  await clearProjectImages(projectId);

  for (let i = 0; i < blobs.length; i++) {
    const dataUrl = await blobToJpegDataUrl(blobs[i]!);
    const id = `slide-${String(i + 1).padStart(2, "0")}`;
    await setDoc(doc(db, "projects", projectId, "images", id), {
      index: i,
      mime: "image/jpeg",
      dataUrl,
      updatedAt: serverTimestamp(),
    });
  }
  return blobs.length;
}

export async function getProjectSlideImages(projectId: string): Promise<string[]> {
  const user = await requireUser();
  const db = getDb();
  const parent = await getDoc(doc(db, "projects", projectId));
  if (!parent.exists() || parent.data().userId !== user.uid) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }
  const snap = await getDocs(
    query(collection(db, "projects", projectId, "images"), orderBy("index", "asc")),
  );
  return snap.docs
    .map((d) => d.data().dataUrl as string | undefined)
    .filter((u): u is string => Boolean(u));
}

export async function deleteProjectClient(id: string) {
  const user = await requireUser();
  const refDoc = doc(getDb(), "projects", id);
  const snap = await getDoc(refDoc);
  if (!snap.exists() || snap.data().userId !== user.uid) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }
  await clearProjectImages(id);
  await deleteDoc(refDoc);
}

export async function deleteProjectsClient(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  for (const id of unique) {
    await deleteProjectClient(id);
  }
}

export async function getIdTokenHeader(): Promise<HeadersInit> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("로그인이 필요합니다.");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}
