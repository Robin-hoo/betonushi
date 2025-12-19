import { api } from "./client";

export interface FavoriteToggleResponse {
    added: boolean;
}

export interface FavoriteStatusResponse {
    isFavorited: boolean;
}

export const favoritesApi = {
    toggleFavorite: async (targetId: number, type: 'food' | 'restaurant' = 'food'): Promise<FavoriteToggleResponse> => {
        const response = await api.post<FavoriteToggleResponse>('/favorites/toggle', { targetId, type });
        return response.data;
    },

    getFavorites: async (type: 'food' | 'restaurant' = 'food', lang?: string) => {
        const params: any = { type };
        if (lang) params.lang = lang;
        const response = await api.get('/favorites', { params });
        return response.data;
    },
    
    checkStatus: async (targetId: number, type: 'food' | 'restaurant' = 'food'): Promise<FavoriteStatusResponse> => {
        const response = await api.get<FavoriteStatusResponse>('/favorites/status', { params: { targetId, type } });
        return response.data;
    }
};
