import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { favoritesApi } from '../api/favorites.api';
import { cn } from '@/lib/utils'; // Assuming shadcn utils exist, checking file structure showed lib dir

interface HeartButtonProps {
  targetId: number;
  type?: 'food' | 'restaurant';
  initialFavorited?: boolean;
  className?: string;
  size?: number;
  iconClassName?: string;
  onToggle?: (newStatus: boolean) => void;
}

export const HeartButton: React.FC<HeartButtonProps> = ({
  targetId,
  type = 'food',
  initialFavorited,
  className,
  size = 24,
  iconClassName,
  onToggle
}) => {
  const { isLoggedIn } = useAuth();
  const [isFavorited, setIsFavorited] = useState<boolean>(!!initialFavorited);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (initialFavorited !== undefined) {
      setIsFavorited(initialFavorited);
      setFetched(true);
    } else if (isLoggedIn && !fetched) {
      // Only fetch if initial status not provided and user is logged in
      favoritesApi.checkStatus(targetId, type)
        .then(res => {
          setIsFavorited(res.isFavorited);
          setFetched(true);
        })
        .catch(err => console.error("Failed to check favorite status", err));
    }
  }, [initialFavorited, isLoggedIn, targetId, type, fetched]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent parent link click
    e.stopPropagation();

    if (loading) return;

    const previousState = isFavorited;
    setIsFavorited(!previousState); // Optimistic
    setLoading(true);

    try {
      const res = await favoritesApi.toggleFavorite(targetId, type);
      // Verify if server response matches our optimistic update
      // if we added, res.added should be true.
      // if we removed, res.added should be false.
      if (res.added !== !previousState) {
        // Conflict? Trust server.
        setIsFavorited(res.added);
      }
      if (onToggle) onToggle(res.added);
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      setIsFavorited(previousState); // Revert
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <button
      onClick={handleClick}
      className={cn("transition-transform hover:scale-110 active:scale-95", className)}
      disabled={loading}
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
