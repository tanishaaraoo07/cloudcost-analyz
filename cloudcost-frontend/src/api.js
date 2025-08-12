// src/api.js
import axios from "axios";

// Base URLs
const BASE_URL = "https://cloudcost-analyz.onrender.com/api";

// Create Auth API instance
export const authApi = axios.create({
  baseURL: `${BASE_URL}/auth`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Create Cloud API instance
export const cloudApi = axios.create({
  baseURL: `${BASE_URL}/cloud`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000 // optional: 10s timeout for slow APIs
});

// Export auth API calls
export const login = (data) => authApi.post("/login", data);
export const signup = (data) => authApi.post("/signup", data);

// Export cloud API calls
export const discover = (data) => cloudApi.post("/discover", data);
export const map = (data) => cloudApi.post("/mapping", data);
export const compare = (data) => cloudApi.post("/compare", data);

// PDF download (as Blob)
// PDF download (as Blob)
export const downloadReport = ({ discovered, mapped, comparison, chartImageBase64 }) =>
  cloudApi.post(
    "/report",
    {
      discovered: discovered || [],
      mapped: mapped || [],
      comparison: comparison || [],
      chartImageBase64: chartImageBase64 || null
    },
    {
      responseType: "blob"
    }
  );
