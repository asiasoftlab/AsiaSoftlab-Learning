import axios from 'axios';

// Support server-side internal API_URL for SSR/builds, falling back to public URL or localhost
const isServer = typeof window === 'undefined';
const rawApiUrl =
  (isServer && process.env.API_URL) ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3001';

const baseURL = rawApiUrl.replace(/\/+$/, '');

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
