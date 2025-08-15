import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IUser } from '~/interfaces/user';
import { customerApi } from '~/api/graphql/account.api';
import { useUser, useUserSignOut } from '~/store/user/userHooks';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (options?: { redirectTo?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const user = useUser();
  const signOut = useUserSignOut();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('customerToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // If we have a token but no user data, try to fetch the user
      if (!user) {
        try {
          await customerApi.getCurrentUser();
        } catch (error) {
          console.error('Error checking authentication:', error);
          await customerApi.signOut();
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      await customerApi.signIn(email, password);
      // The user will be set in the Redux store via the signIn action
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async (options: { redirectTo?: string } = {}) => {
    try {
      await signOut();
      if (options.redirectTo) {
        router.push(options.redirectTo);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      await customerApi.getCurrentUser();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
