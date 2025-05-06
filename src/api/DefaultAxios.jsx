import axios from 'axios';

const DefaultAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

DefaultAxios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

DefaultAxios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default DefaultAxios;
