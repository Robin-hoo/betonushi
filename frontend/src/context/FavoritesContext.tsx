import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getFavorites, addFavorite, removeFavorite, getFavoritesStatus, type Favorite } from '@/api/favorite.api';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
    favorites: Set<number>;
    favoriteFoods: Favorite[];
    isLoading: boolean;
    toggleFavorite: (foodId: number) => Promise<void>;
    checkIsFavorite: (foodId: number) => boolean;
    loadFavorites: () => Promise<void>;
    loadFavoritesStatus: (foodIds: number[]) => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [favoriteFoods, setFavoriteFoods] = useState<Favorite[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load all favorites when user logs in
    const loadFavorites = useCallback(async () => {
        if (!isLoggedIn) {
            setFavorites(new Set());
            setFavoriteFoods([]);
            return;
        }

        setIsLoading(true);
        try {
            const data = await getFavorites();
            setFavoriteFoods(data);
            setFavorites(new Set(data.map(f => f.id)));
        } catch (error) {
            console.error('Failed to load favorites:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    // Load favorites status for specific food IDs
    const loadFavoritesStatus = useCallback(async (foodIds: number[]) => {
        if (!isLoggedIn || foodIds.length === 0) return;

        try {
            const status = await getFavoritesStatus(foodIds);
            setFavorites(prev => {
                const newFavorites = new Set(prev);
                Object.entries(status).forEach(([id, isFavorite]) => {
                    const foodId = parseInt(id);
                    if (isFavorite) {
                        newFavorites.add(foodId);
                    } else {
                        newFavorites.delete(foodId);
                    }
                });
                return newFavorites;
            });
        } catch (error) {
            console.error('Failed to load favorites status:', error);
        }
    }, [isLoggedIn]);

    // Toggle favorite with optimistic update
    const toggleFavorite = useCallback(async (foodId: number) => {
        if (!isLoggedIn) {
            console.warn('User must be logged in to favorite items');
            return;
        }

        const wasFavorited = favorites.has(foodId);

        // Optimistic update
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (wasFavorited) {
                newFavorites.delete(foodId);
            } else {
                newFavorites.add(foodId);
            }
            return newFavorites;
        });

        try {
            if (wasFavorited) {
                await removeFavorite(foodId);
                // Remove from favoriteFoods list
                setFavoriteFoods(prev => prev.filter(f => f.id !== foodId));
            } else {
                await addFavorite(foodId);
                // We don't add to favoriteFoods here because we don't have full data
                // User can reload the favorites page to see it
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            // Revert optimistic update on error
            setFavorites(prev => {
                const newFavorites = new Set(prev);
                if (wasFavorited) {
                    newFavorites.add(foodId);
                } else {
                    newFavorites.delete(foodId);
                }
                return newFavorites;
            });
        }
    }, [isLoggedIn, favorites]);

    const checkIsFavorite = useCallback((foodId: number) => {
        return favorites.has(foodId);
    }, [favorites]);

    // Load favorites when user logs in
    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    return (
        <FavoritesContext.Provider 
            value={{ 
                favorites, 
                favoriteFoods, 
                isLoading, 
                toggleFavorite, 
                checkIsFavorite, 
                loadFavorites,
                loadFavoritesStatus
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
