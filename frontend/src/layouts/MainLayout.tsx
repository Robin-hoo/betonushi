import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />

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

