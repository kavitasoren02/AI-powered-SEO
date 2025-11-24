import axios from "axios"

// Supports different environments (development, production)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 100000,
})

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message)
        return Promise.reject(error)
    },
)

// Add request interceptor for adding auth tokens if needed
api.interceptors.request.use(
    (config) => {
        // You can add authentication tokens here in the future
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config
    },
    (error) => Promise.reject(error),
)

export default api
