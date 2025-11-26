import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import HomePage from '@/pages/HomePage';
import HelpfulPage from '@/pages/HelpfulPage';
import FoodDetailPage from "./pages/FoodDetailPage";
import MenuPage from '@/pages/MenuPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<div className="p-4">About Page</div>} />
          <Route path="/helpful" element={<HelpfulPage />} />
          <Route path="/foods" element={<MenuPage />} />
          <Route path="/foods/:id" element={<FoodDetailPage />} />
          <Route path="/restaurants" element={<HomePage />} />
          <Route path="/phrases" element={<HelpfulPage />} />
          <Route
            path="/about"
            element={<div className="p-4">About Page</div>}
          />
        </Route>
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<div className="text-center">Login Form Placeholder</div>}
          />
          <Route
            path="/register"
            element={
              <div className="text-center">Register Form Placeholder</div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
