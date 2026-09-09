import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/fonts.css';
import './styles/colors.css';
import './styles/typography.css';
import './styles/spacing.css';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminRepairs from './pages/admin/AdminRepairs';
import AdminBuySell from './pages/admin/AdminBuySell';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/admin/AdminLogin';
import About from './pages/About';
import Contact from './pages/Contact';
import BuySell from './pages/BuySell';
import Repair from './pages/Repair';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/"            element={<Home />} />
            <Route path="/shop"        element={<Shop />} />
            <Route path="/categories/*" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about"       element={<About />} />
            <Route path="/contact"     element={<Contact />} />
            <Route path="/buysell"     element={<BuySell />} />
            <Route path="/repair"      element={<Repair />} />
            <Route path="/privacy"     element={<PrivacyPolicy />} />
            <Route path="/terms"       element={<Terms />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index                     element={<AdminDashboard />} />
            <Route path="products"            element={<AdminProducts />} />
            <Route path="products/new"        element={<AdminProductForm />} />
            <Route path="products/:id"        element={<AdminProductForm />} />
            <Route path="orders"              element={<AdminOrders />} />
            <Route path="repairs"             element={<AdminRepairs />} />
            <Route path="buysell"             element={<AdminBuySell />} />
            <Route path="categories"          element={<AdminCategories />} />
            <Route path="brands"              element={<AdminBrands />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
