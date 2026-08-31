import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ROOM API ENDPOINTS
export const getAllRooms = () => api.get("/api/rooms");
export const getAvailableRooms = () => api.get("/api/rooms/available");
export const getRoomById = (id) => api.get(`/api/rooms/${id}`);
export const createRoom = (data) => api.post("/api/rooms", data);
export const updateRoom = (id, data) => api.put(`/api/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/api/rooms/${id}`);
export const uploadRoomImage = (id, formData) =>
  api.post(`/api/rooms/${id}/upload-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// RESERVATION API ENDPOINTS
export const getAllReservations = () => api.get("/reservations");
export const getReservationsByGuest = (guestName) =>
  api.get(`/reservations/guest/${encodeURIComponent(guestName)}`);
export const getReservationById = (id) => api.get(`/reservations/${id}`);
export const createReservation = (data) => api.post("/reservations", data);
export const updateReservation = (id, data) => api.put(`/reservations/${id}`, data);
export const updateReservationStatus = (id, status) =>
  api.patch(`/reservations/${id}/status?status=${encodeURIComponent(status)}`);
export const uploadReservationDocument = (id, formData) =>
  api.post(`/reservations/${id}/upload-document`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);

// FILE UPLOAD API
export const uploadFile = (formData) =>
  api.post("/api/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getFileUrl = (relativeUrl) => {
  if (!relativeUrl) return "";
  if (relativeUrl.startsWith("http")) return relativeUrl;
  return `${API_BASE_URL}${relativeUrl}`;
};

export default api;