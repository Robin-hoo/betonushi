import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import { Toaster } from 'react-hot-toast';
import HelpfulPage from "@/pages/Helpfulpage";
import FoodDetailPage from "@/pages/FoodDetailPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import MenuPage from "@/pages/MenuPage";
import RestaurantsListPage from "@/pages/RestaurantsListPage";
import RestaurantDetailPage from "@/pages/RestaurantDetailPage";
import FoodScriptPage from "./pages/FoodScriptPage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminFoodsPage from "./pages/AdminFoodsPage";
import ProfilePage from "./pages/ProfilePage";
function App() {
  return (
    <Router>
      <Toaster position="top-center" containerStyle={{ marginTop: '80px' }} />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/about"
            element={<div className="p-4">About Page</div>}
          />
          <Route path="/helpful" element={<HelpfulPage />} />
          <Route path="/foods" element={<MenuPage />} />
          <Route path="/foods/:id" element={<FoodDetailPage />} />
          <Route path="/restaurants" element={<RestaurantsListPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="/phrases" element={<HelpfulPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/script/:id" element={<FoodScriptPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin/foods" element={<AdminFoodsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
