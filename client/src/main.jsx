import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/fonts.css';
import './styles/colors.css';
import './styles/typography.css';
import './styles/spacing.css';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminBuySell = lazy(() => import('./pages/admin/AdminBuySell'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminBrands = lazy(() => import('./pages/admin/AdminBrands'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
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
        <Suspense fallback={null}>
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
            <Route path="repairs"             element={<Navigate to="/admin/products" replace />} />
            <Route path="buysell"             element={<AdminBuySell />} />
            <Route path="categories"          element={<AdminCategories />} />
            <Route path="brands"              element={<AdminBrands />} />
          </Route>
        </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
