import axios from "axios";

const BASE_URL = "http://localhost:8080";

const RESERVATION_URL = `${BASE_URL}/reservations`;

// =========================================================
// RESERVATIONS
// =========================================================

// Get ALL reservations
// Mainly for ADMIN
export const getAllReservations = () =>
  axios.get(RESERVATION_URL);

// Backward-compatible name
export const getAll = () =>
  axios.get(RESERVATION_URL);


// Get reservations belonging to a particular guest
// Example:
// /reservations/guest/Shravya
export const getReservationsByGuest = (guestName) =>
  axios.get(
    `${RESERVATION_URL}/guest/${encodeURIComponent(guestName)}`
  );


// Get reservations by email
export const getReservationsByEmail = (email) =>
  axios.get(
    `${RESERVATION_URL}/email/${encodeURIComponent(email)}`
  );


// Create reservation
export const createReservation = (data) =>
  axios.post(RESERVATION_URL, data);


// Backward-compatible name
export const addReservation = (data) =>
  axios.post(RESERVATION_URL, data);


// Get reservation by ID
export const getReservationById = (id) =>
  axios.get(`${RESERVATION_URL}/${id}`);


// Update reservation
export const updateReservation = (id, data) =>
  axios.put(`${RESERVATION_URL}/${id}`, data);


// Update reservation status
export const updateReservationStatus = (id, status) =>
  axios.patch(
    `${RESERVATION_URL}/${id}/status`,
    null,
    {
      params: {
        status: status
      }
    }
  );


// Delete reservation
export const deleteReservation = (id) =>
  axios.delete(`${RESERVATION_URL}/${id}`);


// Upload reservation document
export const uploadReservationDocument = (id, formData) =>
  axios.post(
    `${RESERVATION_URL}/${id}/upload-document`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );


// =========================================================
// ROOMS
// =========================================================

export const getAvailableRooms = () =>
  axios.get(`${BASE_URL}/rooms/available`);


// =========================================================
// FILES
// =========================================================

export const getFileUrl = (fileUrl) => {

  if (!fileUrl) {
    return "";
  }

  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  return `${BASE_URL}${fileUrl}`;
};