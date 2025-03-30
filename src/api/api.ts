import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kreyolkwest-backend.onrender.com/api', // ou ton backend hébergé
});
//https://kreyolkwest-backend.onrender.com

//baseURL: 'http://localhost:5013/api',
export default api;