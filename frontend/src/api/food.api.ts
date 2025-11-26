import { api } from "./client";

export interface Review {
  id: number;
  user_id: number;
  comment: string;
  rating: number;
}

export interface Food {
  id: number;
  name: string;
  rating: number;
  number_of_rating: number;
  story: string;
  ingredient: string;
  taste: string;
  style: string;
  comparison: string;
  images?: string[];
  reviews?: Review[];
}

export async function getFoodById(id: string) {
  const res = await api.get<Food>(`/food/${id}`);
  return res.data;
}
