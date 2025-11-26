import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import HomePage from '@/pages/HomePage';
import HelpfulPage from '@/pages/Helpfulpage';
import FoodDetailPage from "./pages/FoodDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<div className="p-4">About Page</div>} />
          <Route path="/helpful" element={<HelpfulPage />} />
          <Route path="/food" element={<HomePage />} />
          <Route path="/food/:id" element={<FoodDetailPage />} />
          <Route path="/restaurant" element={<HomePage />} />
          <Route path="/phrases" element={<HomePage />} />
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
