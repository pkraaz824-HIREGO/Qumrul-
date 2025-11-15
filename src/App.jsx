import React, { useState, useEffect } from 'react';
import { useAuthStore } from './store';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { AdminPage } from './pages/AdminPage';
import { ContactPage } from './pages/ContactPage';
import { ShippingInfoPage } from './pages/ShippingInfoPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { FAQPage } from './pages/FAQPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CareersPage } from './pages/CareersPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('/');
  const [menuOpen, setMenuOpen] = useState(false);
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Handle routing
  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPage(path);
  }, []);

  const handleNavigation = (path) => {
    setCurrentPage(path);
    window.history.pushState({}, '', path);
    setMenuOpen(false);
  };

  // Listen for browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPage(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Override link clicks
  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.pathname && !link.target) {
        e.preventDefault();
        const path = link.pathname + link.search;
        handleNavigation(path);
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  const renderPage = () => {
    // Handle product detail page with dynamic ID
    if (currentPage.startsWith('/product/')) {
      const productId = currentPage.split('/product/')[1].split('?')[0];
      return <ProductDetailPage productId={productId} />;
    }

    switch (currentPage) {
      case '/':
        return <HomePage />;
      case '/products':
        return <ProductsPage />;
      case '/cart':
        return <CartPage />;
      case '/login':
        return <LoginPage />;
      case '/reset-password':
        return <ResetPasswordPage />;
      case '/my-orders':
        return <MyOrdersPage />;
      case '/admin':
        return <AdminPage />;
      case '/contact':
        return <ContactPage />;
      case '/shipping':
        return <ShippingInfoPage />;
      case '/returns':
        return <ReturnsPage />;
      case '/faq':
        return <FAQPage />;
      case '/about':
        return <AboutPage />;
      case '/privacy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsPage />;
      case '/careers':
        return <CareersPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onMenuClick={() => setMenuOpen(!menuOpen)} isMenuOpen={menuOpen} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
