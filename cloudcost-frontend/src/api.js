import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://cloudcost-backend.onrender.com",
  
});

export default API;
