import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { handleOAuthRedirect } from '../lib/auth-client';

export function OAuthCallbackPage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    handleOAuthRedirect();
    setDone(true);
  }, []);

  if (!done) return null;
  return <Navigate to="/courts" replace />;
}
