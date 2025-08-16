// src/api.js
import axios from "axios";

// 🌐 Base URL for your deployed backend
const BASE_URL = "https://cloudcost-analyz.onrender.com/api";

// ====================
// Axios Instances
// ====================

// Auth API instance
export const authApi = axios.create({
  baseURL: `${BASE_URL}/auth`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cloud API instance
export const cloudApi = axios.create({
  baseURL: `${BASE_URL}/cloud`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Optional: 10s timeout
});

// ====================
// Auth API calls
// ====================
export const login = (data) => authApi.post("/login", data);
export const signup = (data) => authApi.post("/signup", data);

// ====================
// Cloud API calls
// ====================

// Discover resources
export const discover = (data) => cloudApi.post("/discover", data);

// Map services (renamed to avoid JS reserved word confusion)
export const mapServicesApi = (data) => cloudApi.post("/mapping", data);

// Compare costs
export const compareCostsApi = (data) => cloudApi.post("/compare", data);

// Download PDF report
export const downloadReport = ({
  discovered,
  mapped,
  comparison,
  chartImageBase64,
}) =>
  cloudApi.post(
    "/report",
    {
      discovered: discovered || [],
      mapped: mapped || [],
      comparison: comparison || [],
      chartImageBase64: chartImageBase64 || null,
    },
    {
      responseType: "blob", // Important for PDF downloads
    }
  );
