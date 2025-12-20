export type ReferenceCategory = 'product' | 'logo' | 'inspiration' | 'colors' | 'style';

export interface ReferenceImage {
  id: string;
  url: string;
  category: ReferenceCategory;
  enabled: boolean;
  priority: number;
}

export const CATEGORY_CONFIG: Record<ReferenceCategory, {
  label: string;
  icon: string;
  color: string;
}> = {
  product: { label: 'صورة منتج', icon: '📦', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  logo: { label: 'لوجو', icon: '🏷️', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  inspiration: { label: 'إلهام بصري', icon: '✨', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  colors: { label: 'ألوان / هوية', icon: '🎨', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  style: { label: 'أسلوب تصميم', icon: '🖌️', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};
