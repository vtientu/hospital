import axios from "axios";

const mainRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

mainRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default mainRequest;
