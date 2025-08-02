import axios from "axios";

// 🔐 Auth API instance (login/signup)
export const authApi = axios.create({
  baseURL: "https://cloudcost-analyz.onrender.com/api/auth",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// ☁️ Cloud API instance (compare, mapping, discover, report)
export const cloudApi = axios.create({
  baseURL: "http://localhost:5000/api/cloud", // ⬅️ Change to Render URL when deployed
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// 🔐 Auth helpers
export const login = (data) => authApi.post("/login", data);
export const signup = (data) => authApi.post("/signup", data);
