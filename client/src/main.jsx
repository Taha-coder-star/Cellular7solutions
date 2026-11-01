import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/fonts.css';
import './styles/colors.css';
import './styles/typography.css';
import './styles/spacing.css';
import './index.css';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import BuySell from './pages/BuySell';
import Repair from './pages/Repair';
import RepairCategory from './pages/RepairCategory';
import RepairDetail from './pages/RepairDetail';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
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
            <Route path="/repair/:category" element={<RepairCategory />} />
            <Route path="/repair/:category/:repair" element={<RepairDetail />} />
            <Route path="/privacy"     element={<PrivacyPolicy />} />
            <Route path="/terms"       element={<Terms />} />
          </Route>
        </Routes>
    </BrowserRouter>
  </StrictMode>
);
