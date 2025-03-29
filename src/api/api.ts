import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5013/api', // ou ton backend hébergé
});

export default api;