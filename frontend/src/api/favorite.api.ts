import { api } from "./client";

export interface Favorite {
    id: number;
    name: string;
    story: string;
    ingredient: string;
    taste: string;
    style: string;
    comparison: string;
    rating: number;
    number_of_rating: number;
    favorited_at: string;
    images: string[];
}

export interface FavoriteResponse {
    success: boolean;
    data?: Favorite[];
    message?: string;
}

export interface FavoriteStatusResponse {
    success: boolean;
    data?: { [key: number]: boolean };
    message?: string;
}

export interface CheckFavoriteResponse {
    success: boolean;
    isFavorite: boolean;
    message?: string;
}

/**
 * Get all favorites for the authenticated user
 */
export const getFavorites = async (): Promise<Favorite[]> => {
    const response = await api.get<FavoriteResponse>("/favorites");
    return response.data.data || [];
};

/**
 * Add a food item to favorites
 */
export const addFavorite = async (foodId: number): Promise<void> => {
    await api.post("/favorites", { foodId });
};

/**
 * Remove a food item from favorites
 */
export const removeFavorite = async (foodId: number): Promise<void> => {
    await api.delete(`/favorites/${foodId}`);
};

/**
 * Check if a specific food is favorited
 */
export const checkFavorite = async (foodId: number): Promise<boolean> => {
    const response = await api.get<CheckFavoriteResponse>(`/favorites/${foodId}`);
    return response.data.isFavorite;
};

/**
 * Get favorite status for multiple foods
 */
export const getFavoritesStatus = async (foodIds: number[]): Promise<{ [key: number]: boolean }> => {
    if (foodIds.length === 0) return {};
    
    const response = await api.get<FavoriteStatusResponse>("/favorites/status", {
        params: { foodIds: foodIds.join(',') }
    });
    return response.data.data || {};
};
