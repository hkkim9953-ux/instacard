import type { CardSlideData, CardThemeId } from "@/components/CardSlide";

export type ProjectDoc = {
  id: string;
  userId: string;
  title: string;
  themeId: CardThemeId | string;
  themeConfig: Record<string, unknown>;
  slides: CardSlideData[];
  captionText: string | null;
  hashtags: string[];
  sourceText: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectSaveBody = {
  id?: string;
  title: string;
  themeId: CardThemeId;
  slides: CardSlideData[];
  caption?: string;
  hashtags?: string[];
  sourceText?: string;
  bgImage?: string | null;
  mood?: string | null;
  details?: string | null;
};

/** @deprecated snake_case 호환용 */
export type ProjectRow = {
  id: string;
  user_id: string;
  title: string;
  theme_id: string;
  theme_config: Record<string, unknown>;
  slides: CardSlideData[];
  caption_text: string | null;
  hashtags: string[] | null;
  source_text: string | null;
  created_at: string;
  updated_at: string;
};

export function toProjectRow(doc: ProjectDoc): ProjectRow {
  return {
    id: doc.id,
    user_id: doc.userId,
    title: doc.title,
    theme_id: doc.themeId,
    theme_config: doc.themeConfig,
    slides: doc.slides,
    caption_text: doc.captionText,
    hashtags: doc.hashtags,
    source_text: doc.sourceText,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  };
}
