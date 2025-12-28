import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { favoritesApi } from '@/api/favorites.api';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface FavoritesContextType {
  favoriteFoodIds: Set<number>;
  favoriteRestaurantIds: Set<number>;
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (id: number, type: 'food' | 'restaurant') => Promise<void>;
  checkIsFavorited: (id: number, type: 'food' | 'restaurant') => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<Set<number>>(new Set());
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<Set<number>>(new Set());

  const refreshFavorites = useCallback(async () => {
    if (!isLoggedIn) {
      setFavoriteFoodIds(new Set());
      setFavoriteRestaurantIds(new Set());
      return;
    }

    try {
      const [foods, restaurants] = await Promise.all([
        favoritesApi.getFavorites('food'),
        favoritesApi.getFavorites('restaurant')
      ]);

      const foodIds = new Set<number>(foods.map((f: any) => f.target_id || f.food_id));
      const restaurantIds = new Set<number>(restaurants.map((r: any) => r.target_id || r.restaurant_id));

      setFavoriteFoodIds(foodIds);
      setFavoriteRestaurantIds(restaurantIds);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const toggleFavorite = useCallback(async (id: number, type: 'food' | 'restaurant') => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để lưu yêu thích'); // Simplified message, should ideally use translation
      return;
    }

    // Optimistic update
    const updateSet = (prev: Set<number>) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    };

    if (type === 'food') {
      setFavoriteFoodIds(updateSet);
    } else {
      setFavoriteRestaurantIds(updateSet);
    }

    try {
      await favoritesApi.toggleFavorite(id, type);
    } catch (error) {
      console.error('Failed to toggle favorite', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
      // Revert on error
      if (type === 'food') {
        setFavoriteFoodIds(updateSet);
      } else {
        setFavoriteRestaurantIds(updateSet);
      }
    }
  }, [isLoggedIn]);

  const checkIsFavorited = useCallback((id: number, type: 'food' | 'restaurant') => {
    const list = type === 'food' ? favoriteFoodIds : favoriteRestaurantIds;
    return list.has(id);
  }, [favoriteFoodIds, favoriteRestaurantIds]);

  return (
    <FavoritesContext.Provider value={{
      favoriteFoodIds,
      favoriteRestaurantIds,
      refreshFavorites,
      toggleFavorite,
      checkIsFavorited
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
