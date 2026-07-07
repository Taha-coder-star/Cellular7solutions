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

function Shop()          { return <div style={{ padding: 'var(--pad-section)' }}>Shop — coming soon</div>; }
function Login()         { return <div style={{ padding: 'var(--pad-section)' }}>Login — coming soon</div>; }
function Register()      { return <div style={{ padding: 'var(--pad-section)' }}>Register — coming soon</div>; }
function Cart()          { return <div style={{ padding: 'var(--pad-section)' }}>Cart — coming soon</div>; }
function Checkout()      { return <div style={{ padding: 'var(--pad-section)' }}>Checkout — coming soon</div>; }
function ProductDetail() { return <div style={{ padding: 'var(--pad-section)' }}>Product Detail — coming soon</div>; }
function About()         { return <div style={{ padding: 'var(--pad-section)' }}>About — coming soon</div>; }
function Contact()       { return <div style={{ padding: 'var(--pad-section)' }}>Contact — coming soon</div>; }
function BuySell()       { return <div style={{ padding: 'var(--pad-section)' }}>Buy / Sell — coming soon</div>; }
function Unlock()        { return <div style={{ padding: 'var(--pad-section)' }}>Unlock — coming soon</div>; }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/"           element={<Home />} />
              <Route path="/shop"       element={<Shop />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/register"   element={<Register />} />
              <Route path="/cart"       element={<Cart />} />
              <Route path="/checkout"   element={<Checkout />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about"      element={<About />} />
              <Route path="/contact"    element={<Contact />} />
              <Route path="/buysell"    element={<BuySell />} />
              <Route path="/unlock"     element={<Unlock />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
