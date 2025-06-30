import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5004',
  //baseURL: import.meta.env.VITE_API_URL, // ou ton backend hébergé
  withCredentials: true,
});



// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export default api;