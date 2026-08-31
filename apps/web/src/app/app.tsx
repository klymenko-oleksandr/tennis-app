import { Navigate, Route, Routes } from 'react-router';
import { Layout } from '../components/layout';
import { ProtectedRoute } from '../components/protected-route';
import { LoginPage } from '../pages/login-page';
import { OAuthCallbackPage } from '../pages/oauth-callback-page';
import { CourtsListPage } from '../pages/courts-list-page';
import { CourtDetailPage } from '../pages/court-detail-page';
import { BookingsPage } from '../pages/bookings-page';
import { ProfilePage } from '../pages/profile-page';

export function App() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/courts" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/courts" element={<CourtsListPage />} />
        <Route path="/courts/:id" element={<CourtDetailPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
