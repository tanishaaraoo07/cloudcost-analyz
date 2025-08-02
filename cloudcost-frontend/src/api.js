// src/api.js
import axios from "axios";

// Auth API instance
export const authApi = axios.create({
  baseURL: "https://cloudcost-analyz.onrender.com/api/auth",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Cloud API instance
export const cloudApi = axios.create({
  baseURL: "https://cloudcost-analyz.onrender.com/api/cloud", // ✅ Use Render URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Export API methods
export const login = (data) => authApi.post("/login", data);
export const signup = (data) => authApi.post("/signup", data);
export const compare = (data) => cloudApi.post("/compare", data);
export const discover = (data) => cloudApi.post("/discover", data);
export const map = (data) => cloudApi.post("/mapping", data);
export const downloadReport = (data) => cloudApi.post("/report", data, { responseType: "blob" });
