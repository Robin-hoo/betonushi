import { useState, useEffect, useCallback, useRef } from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import defaultRestaurantImage from '@/assets/default.jpg';
import { api } from '@/api/client';
import i18n from '@/i18n';

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
    distance_km?: number;
    liked?: boolean;
}

const DISTANCE_OPTIONS = [
    { key: 'undefined', value: 0, label: 'undefined' },
    { key: '300m', value: 0.3, label: '300m' },
    { key: '1km', value: 1, label: '1km' },
    { key: '3km', value: 3, label: '3km' },
    { key: '5km', value: 5, label: '5km' },
    { key: '10km', value: 10, label: '10km' },
];

const FACILITY_OPTIONS = [
    { key: 'WiFi', value: 'WiFi' },
//    { key: 'Air Conditioning', value: 'Air Conditioning' },
    { key: 'Card Payment', value: 'Card Payment' },
    { key: 'Smoking', value: 'Smoking' },
    { key: 'Parking', value: 'Parking' },
//    { key: 'Private Room', value: 'Private Room' },
//    { key: 'Beer/Alcohol', value: 'Beer/Alcohol' },
//    { key: 'Takeout', value: 'Takeout' },
    { key: 'Late Night', value: 'Late Night' },
    { key: 'RoofSeat', value: 'RoofSeat' },
];

export default function RestaurantsListPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Location state
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Initialize search query from URL
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    // Initialize Filter State similar to MenuPage
    const [selectedFilters, setSelectedFilters] = useState({
        distance: searchParams.get('distance') ? parseFloat(searchParams.get('distance')!) : 0,
        facilities: searchParams.get('facilities') ? searchParams.get('facilities')!.split(',') : [] as string[]
    });
    
    const searchDidMountRef = useRef(false);

    useEffect(() => {
        if (!searchDidMountRef.current) {
            searchDidMountRef.current = true;
            return;
        }

        const handler = setTimeout(() => {
            updateUrlParams({ search: searchQuery });
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError(t('restaurant.location_required'));
                }
            );
        } else {
            setLocationError("Geolocation not supported.");
        }
    }, [t]);

    useEffect(() => {
        const search = searchParams.get('search') || '';
        const distance = searchParams.get('distance') ? parseFloat(searchParams.get('distance')!) : 0;
        const facilities = searchParams.get('facilities') ? searchParams.get('facilities')!.split(',') : [];
        const page = parseInt(searchParams.get('page') || '1', 10);

        setSearchQuery(search);
        setSelectedFilters({ distance, facilities });
        setCurrentPage(page);

        fetchRestaurants({
            search,
            distance,
            facilities
        });
    }, [searchParams, userLocation]);

    // 3. Fetch Function
    const fetchRestaurants = useCallback(async (opts?: {
        search?: string;
        distance?: number;
        facilities?: string[];
    }) => {
        try {
            setLoading(true);
            setError(null);

            const sQuery = opts?.search !== undefined ? opts.search : searchQuery;
            const sDistance = opts?.distance !== undefined ? opts.distance : selectedFilters.distance;
            const sFacilities = opts?.facilities !== undefined ? opts.facilities : selectedFilters.facilities;

            const params = new URLSearchParams();
            params.append('lang', i18n.language);
            
            if (userLocation) {
                params.append('lat', userLocation.lat.toString());
                params.append('lng', userLocation.lng.toString());
                
                if (sDistance > 0) {
                    params.append('distance', sDistance.toString());
                }
            }

            if (sFacilities.length > 0) {
                params.append('facilities', sFacilities.join(','));
            }

            // Client-side search filtering is handled later, or backend if API supports it.
            // Assuming current backend only filters by distance/facilities via API params.
            const response = await api.get(`/restaurants?${params.toString()}`);
            
            let data = response.data.map((restaurant: Restaurant) => ({ ...restaurant, liked: false }));

            // Client-side filtering by name (if backend doesn't support search param)
            if (sQuery.trim()) {
                const lowerQuery = sQuery.toLowerCase();
                data = data.filter((r: Restaurant) => r.name.toLowerCase().includes(lowerQuery));
            }

            setRestaurants(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [i18n.language, userLocation, searchQuery, selectedFilters]); // Depends on state logic

    // 4. Update URL Helper
    const updateUrlParams = (updates: any) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);

            // Update Search
            if (updates.search !== undefined) {
                if (updates.search) newParams.set('search', updates.search);
                else newParams.delete('search');
            }

            // Update Distance
            if (updates.distance !== undefined) {
                if (updates.distance > 0) newParams.set('distance', updates.distance.toString());
                else newParams.delete('distance'); // 0 means unlimited, remove param
            }

            // Update Facilities
            if (updates.facilities !== undefined) {
                if (updates.facilities.length > 0) newParams.set('facilities', updates.facilities.join(','));
                else newParams.delete('facilities');
            }

            // Reset page on filter change
            newParams.delete('page');

            return newParams;
        });
    };

    // 5. Handlers for UI (Local State)
    const handleDistanceChange = (value: number) => {
        // Radio behavior: setting value directly matches selectedFilters structure
        setSelectedFilters(prev => ({ ...prev, distance: value }));
    };

    const handleFacilityChange = (value: string) => {
        setSelectedFilters(prev => {
            const list = prev.facilities;
            const newList = list.includes(value)
                ? list.filter(item => item !== value)
                : [...list, value];
            return { ...prev, facilities: newList };
        });
    };

    const applyFilters = () => {
        updateUrlParams({
            search: searchQuery,
            distance: selectedFilters.distance,
            facilities: selectedFilters.facilities
        });
    };

    const handleToggleLike = (restaurant_id: number) => {
        setRestaurants(restaurants.map(r => 
            r.restaurant_id === restaurant_id ? { ...r, liked: !r.liked } : r
        ));
    };

    // Pagination Logic
    const totalPages = Math.ceil(restaurants.length / itemsPerPage);
    const paginatedRestaurants = restaurants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setSearchParams(prev => {
            const p = new URLSearchParams(prev);
            p.set('page', newPage.toString());
            return p;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full flex flex-col min-h-screen bg-gray-50">
            {/* Search Bar */}
            <div className="w-full bg-white sticky top-0 z-20 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex gap-4">
                    <input
                        type="text"
                        placeholder={t('restaurant.search.placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && updateUrlParams({ search: searchQuery })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button 
                        onClick={() => updateUrlParams({ search: searchQuery })}
                        className="px-8 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                    >
                        {t('restaurant.search.button')}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto w-full px-6 py-8 flex gap-8">
                
                {/* Error/Loading Handling can be placed here similar to MenuPage */}

                {!loading && !error && (
                    <>
                        {/* Sidebar - Filters */}
                        <div className="w-1/5 shrink-0">
                            <div className="bg-[#f7f7f7] rounded-lg p-6 shadow-sm sticky top-24">
                                
                                {/* Distance Filter */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-sm mb-3 text-gray-800 flex items-center gap-2">
                                        {t('restaurant.filters.distance.title', 'Khoảng cách')}
                                    </h3>
                                    
                                    {!userLocation ? (
                                        <p className="text-xs text-gray-500 italic mb-2">
                                            {locationError || t('restaurant.location_required')}
                                        </p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {DISTANCE_OPTIONS.map((item) => (
                                                <li key={item.key} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`distance-${item.key}`}
                                                        // Checked if value matches local state
                                                        checked={selectedFilters.distance === item.value}
                                                        onChange={() => handleDistanceChange(item.value)}
                                                        className="w-4 h-4 accent-purple-600 cursor-pointer rounded-full"
                                                    />
                                                    <label
                                                        htmlFor={`distance-${item.key}`}
                                                        className="text-sm cursor-pointer flex-1"
                                                    >
                                                        {item.value === 0 
                                                            ? t('restaurant.filters.distance.undefined', 'Không xác định') 
                                                            : t(`restaurant.filters.distance.${item.key}`, `Dưới ${item.label}`)
                                                        }
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <hr className="my-4" />
                                
                                {/* Facility Filter */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-sm mb-3 text-gray-800">
                                        {t('restaurant.filters.area.title', 'Tiện nghi')}
                                    </h3>
                                    <ul className="space-y-2">
                                        {FACILITY_OPTIONS.map((item) => (
                                            <li key={item.key} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`facility-${item.key}`}
                                                    checked={selectedFilters.facilities.includes(item.value)}
                                                    onChange={() => handleFacilityChange(item.value)}
                                                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                                                />
                                                <label
                                                    htmlFor={`facility-${item.key}`}
                                                    className="text-sm cursor-pointer flex-1"
                                                >
                                                    {t(`restaurant.facilities.${item.key}`, item.key)}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {/* Single Filter Button */}
                                <button 
                                    onClick={applyFilters}
                                    className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                                >
                                    {t('menu.filter.button', 'Lọc kết quả')}
                                </button>
                            </div>
                        </div>

                        {/* Restaurant Grid */}
                        <div className="flex-1">
                            {loading && (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                                </div>
                            )}

                            {!loading && restaurants.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {paginatedRestaurants.map((restaurant) => (
                                        <div
                                            key={restaurant.restaurant_id}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
                                        >
                                            <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
                                                <img
                                                    src={defaultRestaurantImage}
                                                    alt={restaurant.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition"
                                                />
                                                <button
                                                    onClick={() => handleToggleLike(restaurant.restaurant_id)}
                                                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                                                >
                                                    <Heart
                                                        size={20}
                                                        className={restaurant.liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                                                    />
                                                </button>
                                            </div>
                                            <div className="p-4 flex flex-col flex-1">
                                                <h3 className="font-bold text-lg mb-2 text-gray-800 text-center">
                                                    {restaurant.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2 text-center">
                                                    {restaurant.address || 'Địa chỉ không có sẵn'}
                                                </p>
                                                <button
                                                    onClick={() => navigate(`/restaurants/${restaurant.restaurant_id}`)}
                                                    className="mt-auto w-full py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold hover:border-purple-600 hover:text-purple-600 transition"
                                                >
                                                    {t('restaurant.details')}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                !loading && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg border border-gray-100">
                                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                                            {t('menu.no_results.title', 'Không tìm thấy kết quả')}
                                        </h3>
                                        <button
                                            onClick={() => updateUrlParams({ search: '', distance: 0, facilities: [] })}
                                            className="mt-4 px-6 py-2 bg-purple-100 text-purple-700 font-medium rounded-full hover:bg-purple-200 transition"
                                        >
                                            {t('menu.no_results.clear_search', 'Xóa tìm kiếm')}
                                        </button>
                                    </div>
                                )
                            )}

                            {/* Pagination */}
                            {restaurants.length > 0 && (
                                <div className="flex items-center justify-center gap-2 mb-8">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition disabled:opacity-50"
                                    >
                                        « {t('restaurant.pagination.prev')}
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 text-sm font-semibold rounded transition ${
                                                page === currentPage
                                                    ? 'bg-purple-600 text-white'
                                                    : 'hover:bg-gray-200'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition disabled:opacity-50"
                                    >
                                        {t('restaurant.pagination.next')} »
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}