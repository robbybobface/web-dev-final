import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE
const USER_API = `${API_BASE}/profile`;

const api = axios.create({
    withCredentials: true
});

export const profile = () =>
    api.post(`${USER_API}`)
        .then(response => response.data);
