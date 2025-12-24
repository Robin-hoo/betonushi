import { api } from "./client";

export interface Review {
  review_id: number;
  user_id: number;
  full_name: string;
  comment: string;
  rating: number;
  created_at: string;
}

export interface Food {
  food_id: number;
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
  images_meta?: { food_image_id: number; image_url: string }[];
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

export async function createFood(data: FormData) {
  const res = await api.post('/foods', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function updateFood(id: number | string, data: FormData) {
  const res = await api.put(`/foods/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function deleteFood(id: number | string) {
  const res = await api.delete(`/foods/${id}`);
  return res.data;
}

export async function uploadFoodImage(id: number | string, file: File) {
  const form = new FormData();
  form.append('image', file);
  const res = await api.post(`/foods/${id}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function deleteFoodImage(foodId: number | string, imageId: number | string) {
  const res = await api.delete(`/foods/${foodId}/images/${imageId}`);
  return res.data;
}

export async function addReview(id: number | string, data: { rating: number, comment: string }) {
  const res = await api.post<Review>(`/foods/${id}/reviews`, data);
  return res.data;
}
