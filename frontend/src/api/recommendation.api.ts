import { api } from "./client";
import type { Food } from "./food.api"; // Assuming Food type is exported from food.api

export interface RecommendationParams {
    limit?: number;
    lang?: string;
}

export const getRecommendations = async (params?: RecommendationParams): Promise<Food[]> => {
    const response = await api.get('/recommendations', { params });
    return response.data;
};
