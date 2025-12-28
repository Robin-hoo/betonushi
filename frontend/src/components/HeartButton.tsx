import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/context/FavoritesContext';

interface HeartButtonProps {
  targetId: number;
  type?: 'food' | 'restaurant';
  className?: string;
  size?: number;
  iconClassName?: string;
}

export const HeartButton: React.FC<HeartButtonProps> = ({
  targetId,
  type = 'food',
  className,
  size = 24,
  iconClassName,
}) => {
  const { isLoggedIn } = useAuth();
  const { checkIsFavorited, toggleFavorite } = useFavorites();

  const isFavorited = checkIsFavorited(targetId, type);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) return; // Or show toaster? Main pages handle this but button inside card might need it. Context handles it via toaster.

    await toggleFavorite(targetId, type);
  };

  if (!isLoggedIn) return null;

  return (
    <button
      onClick={handleClick}
      className={cn("transition-transform hover:scale-110 active:scale-95", className)}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size}
        className={cn(
          "transition-colors",
          isFavorited ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400",
          iconClassName
        )}
      />
    </button>
  );
};
