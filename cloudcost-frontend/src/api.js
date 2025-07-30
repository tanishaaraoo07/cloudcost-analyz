import axios from 'axios';

export default axios.create({
  baseURL: 'https://cloudcost-analyz.onrender.com'
,
withCredentials: true, // Updated to Render live backend
});
