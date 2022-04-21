import axios from 'axios';

const API_BASE = process.env.WEB_DEV_FINAL_API_BASE || 'http://localhost:4000/api'
const ARTISTS_API = `${API_BASE}/artists`;

export const findAllArtists = async () => {
    const response = await axios.get(`${ARTISTS_API}`);
    return response.data;
};

export const findArtistById = async (artistId) => {
    const response = await axios.get(`${ARTISTS_API}/${artistId}`);
    return response.data;
};

export const createArtist = async (artist) => {
    const response = await axios.post(ARTISTS_API, artist);
    return response.data;
};

export const deleteArtist = async (artist) => {
    const response = await axios
        .delete(`${ARTISTS_API}/${artist._id}`);
    return response.data;
};
export const updateArtist = async (artist) => {
    const response = await axios
        .put(`${ARTISTS_API}/${artist._id}`, artist);
    return response.data;
};


