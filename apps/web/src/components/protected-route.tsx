import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../lib/auth-context';

export function ProtectedRoute() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}
