import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL,
});

// Public GETs are cached in memory so switching pages doesn't re-wait on the API.
// Logged-in (admin) requests skip it so edits show up immediately.
// ponytail: in-memory only, cleared on reload; add server Cache-Control if first loads matter.
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();
const fetchAdapter = axios.getAdapter(axios.defaults.adapter);
api.defaults.adapter = (config) => {
  if (config.method !== 'get' || config.headers.Authorization) return fetchAdapter(config);
  const key = api.getUri(config);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.promise;
  const promise = fetchAdapter(config).catch((err) => { cache.delete(key); throw err; });
  cache.set(key, { at: Date.now(), promise });
  return promise;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
