import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";
const ALBUMS_API = `${API_BASE}/albums`;

export const findAllAlbums = async () => {
  const response = await axios.get(`${ALBUMS_API}`);
  return response.data;
};

export const findAlbumById = async (albumId) => {
  const response = await axios.get(`${ALBUMS_API}/${albumId}`);
  return response.data;
};

export const createAlbum = async (album) => {
  const response = await axios.post(ALBUMS_API, album);
  return response.data;
};

export const deleteAlbum = async (album) => {
  const response = await axios.delete(`${ALBUMS_API}/${album._id}`);
  return response.data;
};
export const updateAlbum = async (album) => {
  const response = await axios.put(`${ALBUMS_API}/${album._id}`, album);
  return response.data;
};
