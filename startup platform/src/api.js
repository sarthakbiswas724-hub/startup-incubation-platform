import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// Pass tokens if they exist in local storage
instance.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('token');
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;