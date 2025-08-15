import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { customerApi } from '~/api/graphql/account.api';
import { useUser, useUserSignOut } from '~/store/user/userHooks';

export function useAuth(redirectTo = '/account/login') {
  const router = useRouter();
  const user = useUser();
  const signOut = useUserSignOut();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status on mount and when user changes
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('customerToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // If we have a token but no user data, try to fetch the user
      if (!user) {
        try {
          const currentUser = await customerApi.getCurrentUser();
          if (!currentUser) {
            // Token is invalid or expired
            await customerApi.signOut();
            setIsAuthenticated(false);
            return;
          }
          // User will be set via Redux in the getCurrentUser call
        } catch (error) {
          console.error('Error checking authentication:', error);
          await customerApi.signOut();
          setIsAuthenticated(false);
          return;
        }
      }

      setIsAuthenticated(true);
    };

    checkAuth();
  }, [user]);

  const requireAuth = (options: { redirectTo?: string } = {}) => {
    const redirectPath = options.redirectTo || redirectTo;
    
    if (isAuthenticated === false) {
      const returnUrl = window.location.pathname + window.location.search;
      router.push(`${redirectPath}?returnUrl=${encodeURIComponent(returnUrl)}`);
      return false;
    }
    
    return isAuthenticated === true;
  };

  const requireGuest = (options: { redirectTo?: string } = {}) => {
    const redirectPath = options.redirectTo || '/';
    
    if (isAuthenticated === true) {
      router.push(redirectPath);
      return false;
    }
    
    return isAuthenticated === false;
  };

  const logout = async (options: { redirectTo?: string } = {}) => {
    try {
      await signOut();
      if (options.redirectTo) {
        router.push(options.redirectTo);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: isAuthenticated === null,
    requireAuth,
    requireGuest,
    logout,
  };
}
