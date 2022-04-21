import axios from "axios";

const API_BASE = process.env.WEB_DEV_FINAL_API_BASE || 'http://localhost:4000/api';
const SECURITY_API = `${API_BASE}/auth`;

const api = axios.create({
    withCredentials: true
});

export const register = (user) =>
    api.post(`${SECURITY_API}/register`, user)
        .then(response => response.data);

export const login = (user) =>
    api.post(`${SECURITY_API}/login`, user)
        .then(response => response.data).catch(err => 'Invalid Username or Password');

export const logout = () =>
    api.post(`${SECURITY_API}/logout`)
        .then(response => response.data);

export const isAccountOwner = (username) =>
    api.post(`${SECURITY_API}/profile`, username)
        .then(response => response.data).catch(err => console.log(username));

export const isLoggedIn = () =>
    api.get(`${SECURITY_API}/user`)
        .then(response => response.data);

export const changePassword = (password) => {
    api.post(`${SECURITY_API}/change-password`, password)
        .then(response => response.data).catch(err => console.log(password));
};
