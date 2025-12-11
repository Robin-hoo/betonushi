import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import defaultRestaurantImage from '@/assets/default.jpg';

interface Restaurant {
    restaurant_id: number;
    name: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    open_time: string | null;
    close_time: string | null;
    price_range: string | null;
    phone_number: string | null;
    liked?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function RestaurantsListPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter states
    const [distanceFilters, setDistanceFilters] = useState({
        all: true,
        '300m': false,
        '1km': false,
        '3km': false,
        '5km': false,
        '10km': false,
    });

    const [areaFilters, setAreaFilters] = useState({
        downtown: true,
        cardPayment: false,
        smokingArea: false,
        parking: false,
        '24hours': false,
        terrace: false,
    });

    const itemsPerPage = 6;

    // Fetch restaurants from API
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE_URL}/restaurants`);
                if (!response.ok) {
                    throw new Error('Failed to fetch restaurants');
                }
                const data = await response.json();
                setRestaurants(data.map((restaurant: Restaurant) => ({ ...restaurant, liked: false })));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const handleToggleLike = (restaurant_id: number) => {
        setRestaurants(
            restaurants.map((restaurant) =>
                restaurant.restaurant_id === restaurant_id ? { ...restaurant, liked: !restaurant.liked } : restaurant
            )
        );
    };

    const handleDistanceFilterChange = (key: string) => {
        setDistanceFilters({
            ...distanceFilters,
            [key]: !distanceFilters[key as keyof typeof distanceFilters],
        });
    };

    const handleAreaFilterChange = (key: string) => {
        setAreaFilters({
            ...areaFilters,
            [key]: !areaFilters[key as keyof typeof areaFilters],
        });
    };

    const filteredRestaurants = restaurants.filter((restaurant) => {
        return restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
    const paginatedRestaurants = filteredRestaurants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const distanceFilterData = [
        { key: 'all', count: 67 },
        { key: '300m', count: 8 },
        { key: '1km', count: 12 },
        { key: '3km', count: 12 },
        { key: '5km', count: 13 },
        { key: '10km', count: 0 },
    ];

    const areaFilterData = [
        { key: 'downtown' },
        { key: 'cardPayment' },
        { key: 'smokingArea' },
        { key: 'parking' },
        { key: '24hours' },
        { key: 'terrace' },
    ];

    return (
        <div className="w-full flex flex-col min-h-screen bg-gray-50">
            {/* =========================== */}
            {/* Search Bar */}
            {/* =========================== */}
            <div className="w-full bg-white sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex gap-4">
                    <input
                        type="text"
                        placeholder={t('restaurant.search.placeholder')}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button className="px-8 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                        {t('restaurant.search.button')}
                    </button>
                </div>
            </div>

            {/* =========================== */}
            {/* Main Content */}
            {/* =========================== */}
            <div className="max-w-6xl mx-auto w-full px-6 py-8 flex gap-8">
                {/* Loading State */}
                {loading && (
                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">{t('common.loading')}</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{t('common.error')}: {error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                {t('common.retry')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content - Filters and Restaurant Grid */}
                {!loading && !error && (
                    <>
                        {/* Sidebar - Filters */}
                        <div className="w-1/5 shrink-0">
                            <div className="bg-[#f7f7f7] rounded-lg p-6 shadow-sm">
                                {/* Distance Filter */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-sm mb-3 text-gray-800">
                                        {t('restaurant.filters.distance.title')}
                                    </h3>
                                    <ul className="space-y-2">
                                        {distanceFilterData.map((item) => (
                                            <li key={item.key} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`distance-${item.key}`}
                                                    checked={distanceFilters[item.key as keyof typeof distanceFilters]}
                                                    onChange={() => handleDistanceFilterChange(item.key)}
                                                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                                                />
                                                <label
                                                    htmlFor={`distance-${item.key}`}
                                                    className="text-sm cursor-pointer flex-1"
                                                >
                                                    {t(`restaurant.filters.distance.${item.key}`)}
                                                </label>
                                                <span className="text-xs text-gray-500">
                                                    ({item.count})
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Area Filter */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-sm mb-3 text-gray-800">
                                        {t('restaurant.filters.area.title')}
                                    </h3>
                                    <ul className="space-y-2">
                                        {areaFilterData.map((item) => (
                                            <li key={item.key} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`area-${item.key}`}
                                                    checked={areaFilters[item.key as keyof typeof areaFilters]}
                                                    onChange={() => handleAreaFilterChange(item.key)}
                                                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                                                />
                                                <label
                                                    htmlFor={`area-${item.key}`}
                                                    className="text-sm cursor-pointer flex-1"
                                                >
                                                    {t(`restaurant.filters.area.${item.key}`)}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                                    {t('restaurant.filters.button')}
                                </button>
                            </div>
                        </div>

                        {/* Main Content - Restaurant Grid */}
                        <div className="flex-1">
                            {/* Grid Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {paginatedRestaurants.map((restaurant) => (
                                    <div
                                        key={restaurant.restaurant_id}
                                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                                    >
                                        {/* Image */}
                                        <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
                                            <img
                                                src={defaultRestaurantImage}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition"
                                            />
                                            {/* Like Button */}
                                            <button
                                                onClick={() => handleToggleLike(restaurant.restaurant_id)}
                                                aria-label="like"
                                                className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                                            >
                                                <Heart
                                                    size={20}
                                                    className={restaurant.liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                                                />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg mb-2 text-gray-800 text-center">
                                                {restaurant.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 text-center">
                                                {restaurant.address || 'Địa chỉ không có sẵn'}
                                            </p>

                                            {/* Detail Button */}
                                            <button
                                                onClick={() => navigate(`/restaurants/${restaurant.restaurant_id}`)}
                                                className="w-full py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold hover:border-purple-600 hover:text-purple-600 transition"
                                            >
                                                {t('restaurant.details')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* =========================== */}
                            {/* Pagination */}
                            {/* =========================== */}
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    « {t('restaurant.pagination.prev')}
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 text-sm font-semibold rounded transition ${page === currentPage
                                                ? 'bg-purple-600 text-white'
                                                : 'hover:bg-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t('restaurant.pagination.next')} »
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}