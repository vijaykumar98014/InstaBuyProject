import axios from "axios";

export const userAPI = axios.create({
  baseURL: "http://localhost:8082",
});

export const inventoryAPI = axios.create({
  baseURL: "http://localhost:8083",
});

export const orderAPI = axios.create({
  baseURL: "http://localhost:8084",
});


userAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});