import axios from 'axios';

const API_BASE = 'http://localhost:4000/api' || process.env.WEB_DEV_FINAL_API_BASE;
const USER_API = `${API_BASE}/profile`;

const api = axios.create({
    withCredentials: true
});

export const profile = () =>
    api.post(`${USER_API}`)
        .then(response => response.data);
