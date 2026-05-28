import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import OurStory from './pages/OurStory';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Categories from './pages/Categories';
import CategoryProducts from './pages/CategoryProducts';
import OrderDetails from './pages/OrderDetails';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductCreate from './pages/admin/ProductCreate';
import ProductEdit from './pages/admin/ProductEdit';
import CategoryList from './pages/admin/CategoryList';
import OrderList from './pages/admin/OrderList';
import UserList from './pages/admin/UserList';
import Settings from './pages/admin/Settings';
import SiteSettings from './pages/admin/SiteSettings';
import CouponList from './pages/admin/CouponList';
import SubscriberList from './pages/admin/SubscriberList';

// Protected Components
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster 
        position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:slug" element={<CategoryProducts />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="about" element={<OurStory />} />
          <Route path="contact" element={<Contact />} />
          
          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/:id" element={<OrderDetails />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product/create" element={<ProductCreate />} />
            <Route path="product/:id/edit" element={<ProductEdit />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="users" element={<UserList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="site-settings" element={<SiteSettings />} />
            <Route path="coupons" element={<CouponList />} />
            <Route path="subscribers" element={<SubscriberList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
