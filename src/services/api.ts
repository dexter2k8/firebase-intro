import axios from "axios";

const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

const api = axios.create({
  baseURL: clientUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
