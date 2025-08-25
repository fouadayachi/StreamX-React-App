import axios from "axios";

const baseURL = import.meta.env.VITE_TMDB_BASE_URL as string;
const token = import.meta.env.VITE_TMDB_BEARER_TOKEN as string;

if (!baseURL || !token) {
  throw new Error("Missing TMDB environment variables");
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
