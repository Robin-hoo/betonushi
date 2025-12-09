import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { FavoriteButton } from '@/components/FavoriteButton';

const FavoritesPage: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const { favoriteFoods, isLoading, loadFavorites } = useFavorites();

    useEffect(() => {
        if (isLoggedIn) {
            loadFavorites();
        }
    }, [isLoggedIn, loadFavorites]);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-white">
                <PageTitle
                    enTitle="Favorites"
                    jpTitle="お気に入り"
                    description="Please login to view your favorites"
                />
                <div className="max-w-6xl mx-auto px-6 py-12 text-center">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600 mb-6">
                        お気に入りを見るにはログインしてください
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        ログイン
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <PageTitle
                    enTitle="Favorites"
                    jpTitle="お気に入り"
                    description="Your favorite Vietnamese dishes"
                />
                <div className="max-w-6xl mx-auto px-6 py-12 text-center">
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (favoriteFoods.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <PageTitle
                    enTitle="Favorites"
                    jpTitle="お気に入り"
                    description="Your favorite Vietnamese dishes"
                />
                <div className="max-w-6xl mx-auto px-6 py-12 text-center">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600 mb-2">
                        まだお気に入りの料理がありません
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        料理のページで♡ボタンを押してお気に入りに追加しましょう
                    </p>
                    <Link
                        to="/foods"
                        className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        料理を探す
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <PageTitle
                enTitle="Favorites"
                jpTitle="お気に入り"
                description="Your favorite Vietnamese dishes"
            />
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <p className="text-gray-600">
                        {favoriteFoods.length} 件のお気に入り
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteFoods.map((food) => (
                        <Link
                            key={food.id}
                            to={`/food/${food.id}`}
                            className="block group"
                        >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative">
                                    <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
                                        <img
                                            src={food.images?.[0] || '/image/food/placeholder.jpg'}
                                            alt={food.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="absolute top-3 right-3 z-10">
                                        <FavoriteButton
                                            foodId={food.id}
                                            variant="default"
                                        />
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-red-600 transition-colors">
                                        {food.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-semibold text-gray-700">
                                                {food.rating}/5
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            ({food.number_of_rating}件)
                                        </span>
                                    </div>
                                    {food.story && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {food.story}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavoritesPage;
