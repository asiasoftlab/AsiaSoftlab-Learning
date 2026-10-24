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
  timeout: 45000, // 45 seconds timeout to accommodate Render cold starts
});

// Cold-start resilience: safely retry idempotent GET requests when encountering gateway errors (502/503/504) or network timeouts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) {
      return Promise.reject(error);
    }

    const method = (config.method || 'get').toLowerCase();
    const isIdempotent = method === 'get' || method === 'head';
    const status = error.response?.status;
    const isGatewayOrNetworkError =
      status === 502 ||
      status === 503 ||
      status === 504 ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('Network Error');

    // Never retry non-idempotent methods (e.g. POST, PUT, DELETE) to prevent duplicate payments or operations
    if (isIdempotent && isGatewayOrNetworkError) {
      config._retryCount = config._retryCount || 0;
      const maxRetries = 2;

      if (config._retryCount < maxRetries) {
        config._retryCount += 1;
        const delayMs = config._retryCount === 1 ? 1500 : 3000;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return api(config);
      }
    }

    return Promise.reject(error);
  },
);

export const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message;
    if (backendMessage && typeof backendMessage === 'string') {
      return backendMessage;
    }
    if (Array.isArray(backendMessage) && backendMessage.length > 0) {
      return backendMessage.join(', ');
    }
    const status = error.response?.status;
    if (status === 502 || status === 503 || status === 504) {
      return 'The server is currently warming up or temporarily unavailable. Please try again in a moment.';
    }
    return error.message || 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
};
