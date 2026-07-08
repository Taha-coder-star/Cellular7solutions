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
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import BuySell from './pages/BuySell';
import Unlock from './pages/Unlock';
import Repair from './pages/Repair';

function Shop()     { return <div style={{ padding: 'var(--pad-section)' }}>Shop — coming soon</div>; }
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
              <Route path="/cart"        element={<Cart />} />
              <Route path="/checkout"    element={<Checkout />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about"       element={<About />} />
              <Route path="/contact"     element={<Contact />} />
              <Route path="/buysell"     element={<BuySell />} />
              <Route path="/unlock"      element={<Unlock />} />
              <Route path="/repair"      element={<Repair />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
