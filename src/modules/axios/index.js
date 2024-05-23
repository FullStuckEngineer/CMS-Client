import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Add interceptor to automatically add token
instance.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { instance };
