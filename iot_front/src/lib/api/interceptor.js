// src/lib/api/interceptor.js
import { refreshToken } from './auth';
import Cookies from 'js-cookie';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const authFetch = async (url, options = {}) => {
  // Verifica si estamos en el cliente (Cookies solo existen en el cliente)
  if (typeof window === 'undefined') {
    throw new Error('authFetch can only be used on the client side');
  }

  const accessToken = Cookies.get('access_token');
  const refreshTokenValue = Cookies.get('refresh_token');

  // Configuración inicial de la solicitud
  options.headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
  };

  let response = await fetch(url, options);

  // Si el token expiró (401) y tenemos refreshToken, intentamos refrescar
  if (response.status === 401 && refreshTokenValue && !options._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        options.headers['Authorization'] = `Bearer ${token}`;
        return fetch(url, options);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    isRefreshing = true;
    options._retry = true;

    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshToken(refreshTokenValue);
      
      // Actualizamos los tokens en las cookies
      Cookies.set('access_token', newAccessToken, { expires: 1 }); // Expira en 1 día
      Cookies.set('refresh_token', newRefreshToken, { expires: 1 });
      
      // Actualizamos el header de autorización
      options.headers['Authorization'] = `Bearer ${newAccessToken}`;
      
      // Procesamos la cola de solicitudes fallidas
      processQueue(null, newAccessToken);
      
      // Reintentamos la solicitud original
      response = await fetch(url, options);
    } catch (error) {
      // Si falla el refresh, limpiamos las cookies
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      processQueue(error, null);
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
};