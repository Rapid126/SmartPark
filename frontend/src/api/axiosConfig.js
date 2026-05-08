import axios from 'axios';

const api = axios.create({
  // Zamieniamy 10.0.2.2 na prawdziwe IP Twojego komputera w sieci Wi-Fi
  baseURL: 'http://192.168.0.104:5000/api', 
  timeout: 5000,
});

export default api;