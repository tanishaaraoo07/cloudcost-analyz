import axios from "axios";

const instance = axios.create({
  baseURL: "https://your-backend-service.onrender.com", 
  withCredentials: true
});

export default API;
