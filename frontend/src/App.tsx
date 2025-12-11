import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import HomePage from "@/pages/HomePage";
import HelpfulPage from "@/pages/Helpfulpage";
import FoodDetailPage from "@/pages/FoodDetailPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import MenuPage from "@/pages/MenuPage";
import RestaurantsListPage from "@/pages/RestaurantsListPage";
import RestaurantDetailPage from "@/pages/RestaurantDetailPage";
import FoodScriptPage from "./pages/FoodScriptPage";
function App() {
  return (
    <Router>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
