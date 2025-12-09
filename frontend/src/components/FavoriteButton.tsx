import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
    foodId: number;
    variant?: 'default' | 'compact' | 'large';
    showLabel?: boolean;
    className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    foodId,
    variant = 'default',
    showLabel = false,
    className = '',
}) => {
    const { isLoggedIn } = useAuth();
    const { checkIsFavorite, toggleFavorite } = useFavorites();

    if (!isLoggedIn) {
        return null; // Hide button if not logged in
    }

    const isFavorite = checkIsFavorite(foodId);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleFavorite(foodId);
    };

    const sizeClasses = {
        compact: 'w-6 h-6',
        default: 'w-8 h-8',
        large: 'w-10 h-10',
    };

    const iconSizes = {
        compact: 'w-4 h-4',
        default: 'w-5 h-5',
        large: 'w-6 h-6',
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                'rounded-full transition-all duration-200 flex items-center justify-center gap-2',
                'hover:scale-110 active:scale-95',
                isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300',
                !showLabel && sizeClasses[variant],
                showLabel && 'px-4 py-2',
                className
            )}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Heart
                className={cn(
                    iconSizes[variant],
                    isFavorite && 'fill-current'
                )}
            />
            {showLabel && (
                <span className="text-sm font-medium">
                    {isFavorite ? 'お気に入り登録済' : 'お気に入り登録'}
                </span>
            )}
        </button>
    );
};
