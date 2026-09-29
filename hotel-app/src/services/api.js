import axios from "axios";

const BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const RESERVATION_URL = `${BASE_URL}/reservations`;
const ROOM_URL = `${BASE_URL}/api/rooms`;
const AUTH_URL = `${BASE_URL}/api/auth`;


// =====================================================
// AUTH
// =====================================================

export const loginUser = (data) =>
  axios.post(`${AUTH_URL}/login`, data);

export const registerUser = (data) =>
  axios.post(`${AUTH_URL}/register`, data);


// =====================================================
// RESERVATIONS
// =====================================================

export const getAllReservations = () =>
  axios.get(RESERVATION_URL);

export const getAll = () =>
  axios.get(RESERVATION_URL);

export const getReservationsByGuest = (guestName) =>
  axios.get(
    `${RESERVATION_URL}/guest/${encodeURIComponent(guestName)}`
  );

export const getReservationsByEmail = (email) =>
  axios.get(
    `${RESERVATION_URL}/email/${encodeURIComponent(email)}`
  );

export const getReservationsByUser = (username) =>
  axios.get(
    `${RESERVATION_URL}/user/${encodeURIComponent(username)}`
  );

export const createReservation = (data) =>
  axios.post(RESERVATION_URL, data);

export const addReservation = (data) =>
  axios.post(RESERVATION_URL, data);

export const getReservationById = (id) =>
  axios.get(`${RESERVATION_URL}/${id}`);

export const updateReservation = (id, data) =>
  axios.put(`${RESERVATION_URL}/${id}`, data);

export const updateReservationStatus = (id, status) =>
  axios.patch(
    `${RESERVATION_URL}/${id}/status`,
    null,
    {
      params: { status }
    }
  );

export const deleteReservation = (id) =>
  axios.delete(`${RESERVATION_URL}/${id}`);


// =====================================================
// AVAILABLE ROOMS FOR SELECTED DATES
// =====================================================

export const getAvailableRoomsForDates = (
  checkInDate,
  checkOutDate
) =>
  axios.get(
    `${RESERVATION_URL}/available-rooms`,
    {
      params: {
        checkInDate,
        checkOutDate
      }
    }
  );


// =====================================================
// DOCUMENT UPLOAD
// =====================================================

export const uploadReservationDocument = (
  id,
  formData
) =>
  axios.post(
    `${RESERVATION_URL}/${id}/upload-document`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );


// =====================================================
// ROOMS
// =====================================================

export const getAllRooms = () =>
  axios.get(ROOM_URL);

export const getAvailableRooms = () =>
  axios.get(`${ROOM_URL}/available`);

export const getRoomById = (id) =>
  axios.get(`${ROOM_URL}/${id}`);

export const createRoom = (data) =>
  axios.post(ROOM_URL, data);

export const updateRoom = (id, data) =>
  axios.put(`${ROOM_URL}/${id}`, data);

export const deleteRoom = (id) =>
  axios.delete(`${ROOM_URL}/${id}`);


// =====================================================
// ROOM IMAGE UPLOAD
// =====================================================

export const uploadRoomImage = (
  id,
  formData
) =>
  axios.post(
    `${ROOM_URL}/${id}/upload-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );


// =====================================================
// FILE URL
// =====================================================

export const getFileUrl = (fileUrl) => {

  if (!fileUrl) {
    return "";
  }

  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  return `${BASE_URL}${fileUrl}`;
};