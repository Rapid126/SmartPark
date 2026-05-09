import axios from 'axios';

const api = axios.create({
  // Upewnij się, że to IP jest poprawne dla Twojego komputera!
  baseURL: 'http://192.168.0.104:5000/api', 
  timeout: 5000,
});

// Funkcja, którą wywołamy TYLKO raz przy logowaniu
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("Token ustawiony w Axios!");
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;