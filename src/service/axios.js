import axios from "axios";

const api = axios.create({
    baseURL: "https://anvarovich.uz",
});

api.interceptors.request.use((config) => {
    if (config.url.startsWith("/api/admin")) {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
    w;
});

export default api;
