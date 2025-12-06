import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL;
if (baseURL && !baseURL.startsWith("http")) {
  baseURL = "http://" + baseURL;
}
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
