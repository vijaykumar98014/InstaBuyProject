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

export const setAuthToken = (token) => {
  if (token) {
    userAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete userAPI.defaults.headers.common.Authorization;
  }
};