import axios from "axios";

// Set up the base URL for your backend API
const instance = axios.create({
  baseURL: "https://cloudcost-analyz.onrender.com/api/auth",
  withCredentials: true, // allows cookies if you plan to use them
  headers: {
    "Content-Type": "application/json"
  }
});

export default instance;

// Optional: helper functions
export const login = (data) => instance.post("/login", data);
export const signup = (data) => instance.post("/signup", data);
