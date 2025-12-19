import { api } from "./client";

export interface RestaurantFood {
  food_id: number;
  name: string;
  story: string;
  price: number;
  is_recommended: boolean;
  image_url: string | null;
}

export interface Review {
  review_id: number;
  user_id: number;
  user_name: string | null;
  avatar_url: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Restaurant {
  restaurant_id: number;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  open_time: string | null;
  close_time: string | null;
  price_range: string | null;
  phone_number: string | null;
  rating: number;
  number_of_rating: number;
  foods: RestaurantFood[];
  facilities: string[];
  reviews: Review[];
}

export async function getRestaurantById(id: string, lang?: string) {
  const url = lang ? `/restaurants/${id}?lang=${encodeURIComponent(lang)}` : `/restaurants/${id}`;
  const res = await api.get<Restaurant>(url);
  return res.data;
}

