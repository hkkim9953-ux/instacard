import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, verifyIdToken } from "@/lib/firebase/admin";
import type { ProjectSaveBody } from "@/lib/projects";

async function requireUid(req: Request) {
  try {
    const decoded = await verifyIdToken(req.headers.get("authorization"));
    if (!decoded?.uid) {
      return { error: NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 }) };
    }
    return { uid: decoded.uid };
  } catch (e) {
    const message = e instanceof Error ? e.message : "인증 실패";
    const status = message.includes("Admin") ? 503 : 401;
    return { error: NextResponse.json({ error: message }, { status }) };
  }
}

export async function GET(req: Request) {
  const auth = await requireUid(req);
  if ("error" in auth && auth.error) return auth.error;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: "Firebase Admin이 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const snap = await db
    .collection("projects")
    .where("userId", "==", auth.uid)
    .orderBy("updatedAt", "desc")
    .get();

  const projects = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title,
      theme_id: data.themeId,
      slides: data.slides ?? [],
      caption_text: data.captionText ?? null,
      hashtags: data.hashtags ?? [],
      created_at: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
      updated_at: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
    };
  });

  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const auth = await requireUid(req);
  if ("error" in auth && auth.error) return auth.error;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: "Firebase Admin이 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  let body: ProjectSaveBody;
  try {
    body = (await req.json()) as ProjectSaveBody;
  } catch {
    return NextResponse.json({ error: "잘못된 JSON입니다." }, { status: 400 });
  }

  if (!body.title?.trim() || !Array.isArray(body.slides) || body.slides.length === 0) {
    return NextResponse.json(
      { error: "title과 slides가 필요합니다." },
      { status: 400 },
    );
  }

  const payload = {
    userId: auth.uid!,
    title: body.title.trim(),
    themeId: body.themeId || "minimal-light",
    themeConfig: {
      themeId: body.themeId,
      ...(body.bgImage ? { bgImage: body.bgImage } : {}),
    },
    slides: body.slides,
    captionText: body.caption ?? null,
    hashtags: body.hashtags ?? [],
    sourceText: body.sourceText ?? null,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (body.id) {
    const ref = db.collection("projects").doc(body.id);
    const existing = await ref.get();
    if (!existing.exists || existing.data()?.userId !== auth.uid) {
      return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
    }
    await ref.update(payload);
    return NextResponse.json({
      project: { id: body.id, title: payload.title },
    });
  }

  const created = await db.collection("projects").add({
    ...payload,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json(
    { project: { id: created.id, title: payload.title } },
    { status: 201 },
  );
}
