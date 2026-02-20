import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { LoadingSpinner } from '../ui/LoadingSpinner.js';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
