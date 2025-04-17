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
  // Verifica si estamos en el cliente
  if (typeof window === 'undefined') {
    throw new Error('authFetch can only be used on the client side');
  }

  // Configuración inicial de headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Obtiene tokens (si existen)
  const accessToken = Cookies.get('access_token');
  const refreshTokenValue = Cookies.get('refresh_token');

  // Agrega el token de acceso si existe
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Primera llamada a la API
  let response = await fetch(url, { ...options, headers });

  // Manejo de token expirado (401)
  if (response.status === 401 && refreshTokenValue && !options._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        headers['Authorization'] = `Bearer ${token}`;
        return fetch(url, { ...options, headers });
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    isRefreshing = true;
    options._retry = true;

    try {
      // Intenta renovar el token
      const { access_token: newAccessToken, refresh_token: newRefreshToken } = await refreshToken(refreshTokenValue);

      // Actualiza cookies (configuración segura recomendada)
      Cookies.set('access_token', newAccessToken, {
        expires: 1, // 1 día
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      Cookies.set('refresh_token', newRefreshToken, {
        expires: 7, // 7 días
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Actualiza el header y reprocesa la cola
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

      // Reintenta la solicitud original
      response = await fetch(url, { ...options, headers });

    } catch (error) {
      // Limpia cookies y redirige si el refresh falla
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      processQueue(error, null);
      
      // Redirige a login (opcional)
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
      throw new Error('Session expired. Please login again.');
    } finally {
      isRefreshing = false;
    }
  }

  // Si sigue siendo un 401 después del refresh, lanza error
  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  return response;
};