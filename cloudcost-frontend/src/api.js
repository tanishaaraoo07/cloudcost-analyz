const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

// 🔐 Auth API instance (login/signup)
export const authApi = axios.create({
  baseURL: `${BASE_URL}/api/auth`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// ☁️ Cloud API instance (compare, mapping, discover, report)
export const cloudApi = axios.create({
  baseURL: `${BASE_URL}/api/cloud`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// 🔐 Auth helpers
export const login = (data) => authApi.post("/login", data);
export const signup = (data) => authApi.post("/signup", data);
