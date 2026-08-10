import { NextResponse } from "next/server";
import { getAdminDb, verifyIdToken } from "@/lib/firebase/admin";

type Params = { params: Promise<{ id: string }> };

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

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  const auth = await requireUid(req);
  if ("error" in auth && auth.error) return auth.error;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: "Firebase Admin이 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const snap = await db.collection("projects").doc(id).get();
  if (!snap.exists || snap.data()?.userId !== auth.uid) {
    return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  const data = snap.data()!;
  return NextResponse.json({
    project: {
      id: snap.id,
      user_id: data.userId,
      title: data.title,
      theme_id: data.themeId,
      theme_config: data.themeConfig ?? {},
      slides: data.slides ?? [],
      caption_text: data.captionText ?? null,
      hashtags: data.hashtags ?? [],
      source_text: data.sourceText ?? null,
      created_at: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
      updated_at: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
    },
  });
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = await params;
  const auth = await requireUid(req);
  if ("error" in auth && auth.error) return auth.error;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: "Firebase Admin이 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const ref = db.collection("projects").doc(id);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.userId !== auth.uid) {
    return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  const imageRefs = await ref.collection("images").listDocuments();
  // Admin SDK batch limit 500
  for (let i = 0; i < imageRefs.length; i += 400) {
    const batch = db.batch();
    imageRefs.slice(i, i + 400).forEach((r) => batch.delete(r));
    await batch.commit();
  }
  await ref.delete();
  return NextResponse.json({ ok: true });
}
