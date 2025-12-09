import { Link, NavLink } from "react-router-dom";
import foodIcon from "../assets/icon/japanese-food.svg";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu";

const Header = () => {
    const { t } = useTranslation();
    const { isLoggedIn } = useAuth();

    const navLinks = [
        { name: t("header.nav.home"), href: "/" },
        { name: t("header.nav.menu"), href: "/foods" },
        { name: t("header.nav.restaurant"), href: "/restaurants" },
        { name: t("header.nav.phrases"), href: "/phrases" },
    ];

    return (
        <header className="flex items-center justify-between px-6 md:px-12 py-4 bg-[#fdfbf7] border-b border-gray-200 w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
                <img className="h-10 w-10" src={foodIcon} alt="Japanese Food" />
                <div className="text-[#c44536] font-bold text-xl whitespace-nowrap">
                    ベトめし
                </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.href}
                        to={link.href}
                        end={link.href === "/"}
                        className={({ isActive }) =>
                            `px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                ? "bg-[#dbdfd0] text-gray-900"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <LanguageSwitcher />

                {isLoggedIn ? (
                    <UserMenu />
                ) : (
                    <>
                        <Link to="/login">
                            <Button
                                variant="outline"
                                className="px-5 py-2 rounded-full text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                {t("header.login")}
                            </Button>
                        </Link>

                        <Button
                            className="px-5 py-2 rounded-full text-sm font-medium bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                        >
                            {t("header.signup")}
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;

