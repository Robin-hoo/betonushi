import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import HomePage from '@/pages/HomePage';
import FoodDetailPage from "./pages/FoodDetailPage";
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<div className="p-4">About Page</div>} />
          <Route path="/foods" element={<MenuPage />} />
          <Route path="/foods/:id" element={<FoodDetailPage />} />
          <Route path="/food/:id" element={<FoodDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/restaurant" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
