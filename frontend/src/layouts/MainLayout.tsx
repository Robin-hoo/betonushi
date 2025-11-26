import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="border-b flex justify-center">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Betomeshi</h1>
          <nav className="ml-auto flex gap-4">
            <a href="/" className="text-sm font-medium hover:underline">Home</a>
            <a href="/about" className="text-sm font-medium hover:underline">About</a>
          </nav>
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
