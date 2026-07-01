import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';

function Home() { return <div>Home</div>; }
function Shop() { return <div>Shop</div>; }
function Login() { return <div>Login</div>; }
function Register() { return <div>Register</div>; }
function Cart() { return <div>Cart</div>; }
function Checkout() { return <div>Checkout</div>; }
function ProductDetail() { return <div>Product Detail</div>; }
function About() { return <div>About</div>; }
function Contact() { return <div>Contact</div>; }
function BuySell() { return <div>Buy / Sell</div>; }
function Unlock() { return <div>Unlock</div>; }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/buysell" element={<BuySell />} />
              <Route path="/unlock" element={<Unlock />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
