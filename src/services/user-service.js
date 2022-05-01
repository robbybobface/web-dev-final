import axios from 'axios';

const API_BASE =  process.env.REACT_APP_API_BASE || 'http://localhost:4000/api'
const USERS_API = `${API_BASE}/users`;

export const createUser = async (user) => {
    const response = await axios.post(USERS_API, user, { withCredentials: true });
    return response.data;
};

export const findAllUsers = async (search) => {
    if (search) {
        const response = await axios.get(`${USERS_API}?${search}`, { withCredentials: true });
        return response.data;
    } else {
        const response = await axios.get(`${USERS_API}${search}`, { withCredentials: true });
        return response.data;
    }
};

export const deleteUser = async (user) => {
    const response = await axios
        .delete(`${USERS_API}/${user._id}`, { withCredentials: true });
    return response.data;
};
export const updateUser = async (user) => {
    const response = await axios
        .put(`${USERS_API}/${user._id}`, user, { withCredentials: true });
    return response.data;
};

export const findUserByUsername = async (username) => {
    const response = await axios.get(`${USERS_API}/${username}`, { withCredentials: true });
    return response.data;
};

export const findUserByEmail = async (email) => {
    const response = await axios.get(`${USERS_API}/${email}`, { withCredentials: true });
    return response.data;
};


