import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, LogOut, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserMenu = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
            >
                {/* Avatar */}
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                    <img
                        src={user.avatarUrl || "https://api.dicebear.com/9.x/micah/svg?seed=User"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                    />
                </div>
                {/* Name */}
                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user.name}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 py-1">
                    {/* Items */}
                    <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                    >
                        <UserIcon className="w-4 h-4" />
                        {t("header.profile")}
                    </button>
                    <Link to="/favorites">
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => setIsOpen(false)}
                        >
                            <Heart className="w-4 h-4" />
                            {t("header.favorites")}

                        </button>
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                    >
                        <LogOut className="w-4 h-4" />
                        {t("header.log-out")}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
