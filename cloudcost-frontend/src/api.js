import axios from "axios";

const instance = axios.create({
  baseURL: "https://cloudcost-analyz.onrender.com", 
  withCredentials: true
});

export default API;
