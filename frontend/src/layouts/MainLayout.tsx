import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

const MainLayout = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header />

        <main className="py-6 flex justify-center">
          <Outlet />
        </main>
        <footer className="w-full border-t py-6">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Betomeshi. All rights reserved.
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default MainLayout;

