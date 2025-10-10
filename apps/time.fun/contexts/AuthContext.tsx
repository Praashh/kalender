import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { tokenStorage, User } from '@/utils/tokenStorage';
import { api } from '@/utils/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const isAuth = await tokenStorage.isAuthenticated();
      const userData = await tokenStorage.getUser();
      
      setIsAuthenticated(isAuth);
      setUser(userData);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await api.auth.login.post({ email, password });
      
      if (response.error) {
        console.error('Login error:', response.error);
        return false;
      }

      const data = response.data;
      
      if (!data.token) {
        throw new Error('No token received');
      }

      // Create user object from response data
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || "",
      };
      
      // Store token and user data
      await tokenStorage.setToken(data.token);
      await tokenStorage.setUser(user);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await api.auth.register.post({ name, email, password });
      
      if (response.error) {
        console.error('Registration error:', JSON.stringify(response.error));
        return false;
      }

      const data = response.data;
      
      if (!data.token) {
        throw new Error('No token received');
      }

      // Create user object from response data
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || "",
      };
      
      // Store token and user data
      await tokenStorage.setToken(data.token);
      await tokenStorage.setUser(user);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await tokenStorage.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
