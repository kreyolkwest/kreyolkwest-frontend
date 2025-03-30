import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ou ton backend hébergé
});
//https://kreyolkwest-backend.onrender.com

//baseURL: 'http://localhost:5013/api',
export default api;