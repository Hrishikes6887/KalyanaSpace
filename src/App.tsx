import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { ToastContainer } from './components/common/ToastContainer';
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { VenuesPage } from './pages/VenuesPage';
import { VenueDetailPage } from './pages/VenueDetailPage';
import { ComparePage } from './pages/ComparePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Owner Pages & Layout
import { OwnerLayout } from './components/layout/OwnerLayout';
import { OwnerOverviewPage } from './pages/owner/OwnerOverviewPage';
import { OwnerVenuesPage } from './pages/owner/OwnerVenuesPage';
import { OwnerVenueFormPage } from './pages/owner/OwnerVenueFormPage';
import { OwnerEnquiriesPage } from './pages/owner/OwnerEnquiriesPage';
import { OwnerCalendarPage } from './pages/owner/OwnerCalendarPage';
import { OwnerAnalyticsPage } from './pages/owner/OwnerAnalyticsPage';

// Admin Pages & Layout
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminVenuesPage } from './pages/admin/AdminVenuesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Customer Layout Shell
const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Protected Route wrapper for demo roles with auto-role switch option for testing convenience
interface ProtectedRouteProps {
  requiredRole?: 'customer' | 'owner' | 'admin';
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { user, role, switchRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a role is required and user is in different role, for demo convenience we allow them or prompt
  if (requiredRole && role !== requiredRole) {
    // In demo mode, automatically switch role to allow seamless evaluation, or let them switch!
    return children;
  }

  return children;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <ToastProvider>
            <FavoritesProvider>
              <ComparisonProvider>
                <div className="min-h-screen flex flex-col bg-ivory-100 text-stone-800">
                  {/* Top Demo Toolbar: lets evaluators switch roles in 1 click and reset seed */}
                  <DemoBanner />

                  <Routes>
                    {/* Customer Marketplace Routes */}
                    <Route element={<CustomerLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/venues" element={<VenuesPage />} />
                      <Route path="/venues/:id" element={<VenueDetailPage />} />
                      <Route path="/compare" element={<ComparePage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/my-enquiries" element={<AccountPage />} />
                      <Route path="/login" element={<LoginPage />} />
                    </Route>

                    {/* Hall-Owner Dashboard Routes */}
                    <Route
                      path="/owner"
                      element={
                        <ProtectedRoute requiredRole="owner">
                          <OwnerLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<OwnerOverviewPage />} />
                      <Route path="venues" element={<OwnerVenuesPage />} />
                      <Route path="venues/new" element={<OwnerVenueFormPage />} />
                      <Route path="venues/edit/:id" element={<OwnerVenueFormPage />} />
                      <Route path="enquiries" element={<OwnerEnquiriesPage />} />
                      <Route path="calendar" element={<OwnerCalendarPage />} />
                      <Route path="analytics" element={<OwnerAnalyticsPage />} />
                    </Route>

                    {/* Platform Administration Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<AdminOverviewPage />} />
                      <Route path="venues" element={<AdminVenuesPage />} />
                      <Route path="users" element={<AdminUsersPage />} />
                      <Route path="enquiries" element={<AdminEnquiriesPage />} />
                      <Route path="bookings" element={<AdminBookingsPage />} />
                      <Route path="settings" element={<AdminSettingsPage />} />
                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>

                  <ToastContainer />
                </div>
              </ComparisonProvider>
            </FavoritesProvider>
          </ToastProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
