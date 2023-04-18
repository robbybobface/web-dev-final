import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";
const TRACKS_API = `${API_BASE}/tracks`;

export const findAllTracks = async () => {
  const response = await axios.get(`${TRACKS_API}`);
  return response.data;
};

export const findTrackById = async (trackId) => {
  const response = await axios.get(`${TRACKS_API}/${trackId}`);
  return response.data;
};

export const createTrack = async (track) => {
  const response = await axios.post(TRACKS_API, track);
  return response.data;
};

export const deleteTrack = async (track) => {
  const response = await axios.delete(`${TRACKS_API}/${track._id}`);
  return response.data;
};
export const updateTrack = async (track) => {
  const response = await axios.put(`${TRACKS_API}/${track._id}`, track);
  return response.data;
};
