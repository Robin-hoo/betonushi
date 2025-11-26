import { Outlet } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import foodIcon from "../assets/icon/japanese-food.svg";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const MainLayout = () => {
  const { t } = useTranslation();
  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("menu"), href: "/food" },
    { name: t("restaurant"), href: "/restaurant" },
    { name: t("phrases"), href: "/phrases" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="flex flex-col md:flex-row md:items-center justify-between px-8 py-4 md:py-0 bg-transparent min-w-[320px] w-full gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img className="h-12 w-12" src={foodIcon} alt="Japanese Food" />
          <div className="text-[#ec5600] font-serif font-semibold text-2xl whitespace-nowrap">
            ベトめし
          </div>
        </Link>

        <nav className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 mt-2 md:mt-0 pr-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full font-medium text-black hover:text-gray-800 transition-colors ${
                  isActive ? "bg-gray-200" : "hover:bg-gray-100"
                }`
              }
            >
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <LanguageSwitcher />

          <Button
            variant="login_style"
            className="px-4 py-2 rounded-full text-black hover:text-gray-800 transition-colors"
          >
            <span className="get-started-now">{t("login")}</span>
          </Button>
        </div>
      </header>

      <main className="container py-6 flex justify-center">
        <Outlet />
      </main>
      <footer className="w-full border-t py-6">
        <div className="text-center text-sm text-muted-foreground">
          © 2024 Betomeshi. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
