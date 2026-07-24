import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/fonts.css';
import './styles/colors.css';
import './styles/typography.css';
import './styles/spacing.css';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
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
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import BuySell from './pages/BuySell';
import Repair from './pages/Repair';
import Shop from './pages/Shop';

function Checkout() { return <div style={{ padding: 'var(--pad-section)' }}>Checkout — coming soon</div>; }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/"            element={<Home />} />
              <Route path="/shop"        element={<Shop />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/cart"        element={<Cart />} />
              <Route path="/checkout"    element={<Checkout />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about"       element={<About />} />
              <Route path="/contact"     element={<Contact />} />
              <Route path="/buysell"     element={<BuySell />} />
              <Route path="/repair"      element={<Repair />} />
            </Route>
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
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
