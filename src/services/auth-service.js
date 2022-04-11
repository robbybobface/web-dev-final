import axios from "axios";

const API_BASE = 'http://localhost:4000/api' || process.env.WEB_DEV_FINAL_API_BASE;
const SECURITY_API = `${API_BASE}/auth`;

const api = axios.create({
    withCredentials: true
});

export const register = (user) =>
    api.post(`${SECURITY_API}/register`, user)
        .then(response => response.data);

export const login = (user) =>
    api.post(`${SECURITY_API}/login`, user)
        .then(response => response.data);

export const logout = () =>
    api.post(`${SECURITY_API}/logout`)
        .then(response => response.data);

export const isAccountOwner = (user) =>
    api.post(`${SECURITY_API}/profile`, user)
        .then(response => response.data);

export const isLoggedIn = () =>
    api.get(`${SECURITY_API}/user`)
        .then(response => response.data);
