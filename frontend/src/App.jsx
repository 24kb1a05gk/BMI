import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import MealSuggestions from './pages/MealSuggestions';
import WeeklySchedulePage from './pages/WeeklySchedulePage';
import Profile from './pages/Profile';
import SavedMeals from './pages/SavedMeals';
import About from './pages/About';
import Contact from './pages/Contact';

function Layout({ children }) {
  const location = useLocation();
  // Sidebar-based pages have their own layout, but keep global navbar and footer where appropriate
  const isDashboardPage = [
    '/dashboard',
    '/suggestions',
    '/schedule',
    '/saved-meals',
    '/profile'
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
      {!isDashboardPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Profile Setup (Protected, but allows users without profile) */}
              <Route
                path="/profile-setup"
                element={
                  <ProtectedRoute requireProfile={false}>
                    <ProfileSetup />
                  </ProtectedRoute>
                }
              />

              {/* Protected Dashboard & App Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suggestions"
                element={
                  <ProtectedRoute>
                    <MealSuggestions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <WeeklySchedulePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-meals"
                element={
                  <ProtectedRoute>
                    <SavedMeals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
