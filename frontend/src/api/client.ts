import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});