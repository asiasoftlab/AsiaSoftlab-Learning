import axios from 'axios';

// Support server-side internal backend URL for SSR/builds, and relative same-origin /api in browser for production
const isServer = typeof window === 'undefined';

const getBaseUrl = (): string => {
  if (isServer) {
    const serverUrl =
      process.env.INTERNAL_API_URL ||
      process.env.BACKEND_URL ||
      process.env.API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://asiasoftlab-learning-1.onrender.com'
        : 'http://localhost:3001');
    return serverUrl.replace(/\/+$/, '');
  }

  // Client-side in browser
  if (process.env.NODE_ENV === 'production') {
    const publicUrl = process.env.NEXT_PUBLIC_API_URL;
    if (publicUrl && publicUrl.startsWith('/')) {
      return publicUrl.replace(/\/+$/, '');
    }
    return '/api';
  }

  // Local development: keep existing configuration/URL
  const clientUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return clientUrl.replace(/\/+$/, '');
};

const baseURL = getBaseUrl();

export const api = axios.create({
  baseURL,
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
});


export const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return 'An unexpected error occurred';
};
