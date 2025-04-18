'use client'; // Marcar como Client Component

import { createContext, useContext, useEffect, useState } from 'react';
import { login, register, refreshToken } from '@/lib/api/auth';
import Cookies from 'js-cookie';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar recuperar sesión al cargar
    const initializeAuth = async () => {
      try {
        const token = Cookies.get('access_token');
        const userData = Cookies.get('user');
        
        if (token && userData) {
          setAccessToken(token);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        signOut();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (credentials) => {
    try {
      const data = await login(credentials);
      // Guardar en cookies
      Cookies.set('access_token', data.access_token, { expires: 1 }); // Expira en 1 día
      Cookies.set('refresh_token', data.refresh_token, { expires: 1 });
      Cookies.set('user', JSON.stringify(data.user), { expires: 1 });
      
      setAccessToken(data.access_token);
      setUser(data.user);
      // console.log("fetch")
      // console.log(data)
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (userData) => {
    try {
      const data = await register(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
     // Eliminar cookies
     Cookies.remove('access_token');
     Cookies.remove('refresh_token');
     Cookies.remove('user');

    setAccessToken(null);
    setUser(null);
  };

  const value = {
    user,
    accessToken,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}



export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}