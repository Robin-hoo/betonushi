import { api } from "./client";

export interface Review {
  review_id: number;
  user_id: number;
  comment: string;
  rating: number;
  created_at: string;
}

export interface Food {
  food_id : number;
  name: string;
  story: string;
  ingredient: string;
  taste: string;
  style: string;
  comparison: string;
  region_id?: number;
  view_count: number;
  rating: number;
  number_of_rating: number;
  created_at: string;
  image_url: string;
  images?: string[];
  reviews?: Review[];
}

export async function getFoodById(id: string, lang?: string) {
  // Note: always use `/foods/${id}` (plural) — backend expects this path
  const url = lang ? `/foods/${id}?lang=${encodeURIComponent(lang)}` : `/foods/${id}`;
  const res = await api.get<Food>(url);
  return res.data;
}

export async function getFoods(lang?: string) {
  const url = lang ? `/foods?lang=${encodeURIComponent(lang)}` : `/foods`;
  const res = await api.get<Food[]>(url);
  return res.data;
}
