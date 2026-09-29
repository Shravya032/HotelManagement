import axios from "axios";

const BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const RESERVATION_URL = `${BASE_URL}/reservations`;
const ROOM_URL = `${BASE_URL}/api/rooms`;
const AUTH_URL = `${BASE_URL}/api/auth`;

// =====================================================
// DEMO / OFFLINE FALLBACK DATA & HELPERS
// =====================================================

const INITIAL_ROOMS = [
  {
    id: 101,
    roomNumber: "101",
    roomType: "DELUXE",
    pricePerNight: 250,
    available: true,
    maxOccupancy: 2,
    imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    description: "Luxury Deluxe Room with Ocean View and King Size Bed."
  },
  {
    id: 102,
    roomNumber: "102",
    roomType: "SUITE",
    pricePerNight: 450,
    available: true,
    maxOccupancy: 4,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    description: "Spacious Executive Suite with Private Balcony and Jacuzzi."
  },
  {
    id: 103,
    roomNumber: "103",
    roomType: "PRESIDENTIAL",
    pricePerNight: 850,
    available: true,
    maxOccupancy: 6,
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    description: "Top-floor Presidential Suite with Panoramic Sea Views and Private Chef Service."
  },
  {
    id: 104,
    roomNumber: "104",
    roomType: "STANDARD",
    pricePerNight: 150,
    available: true,
    maxOccupancy: 2,
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    description: "Comfortable Standard King Room with City View."
  },
  {
    id: 105,
    roomNumber: "105",
    roomType: "FAMILY",
    pricePerNight: 350,
    available: true,
    maxOccupancy: 5,
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    description: "Spacious Family Villa with Garden Access."
  }
];

const INITIAL_RESERVATIONS = [
  {
    id: 1,
    guestName: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    roomNumber: "101",
    roomType: "DELUXE",
    checkInDate: "2026-10-01",
    checkOutDate: "2026-10-05",
    numberOfGuests: 2,
    totalPrice: 1000,
    status: "CONFIRMED"
  }
];

const getDemoRooms = () => {
  const stored = localStorage.getItem("demo_rooms");
  if (!stored) {
    localStorage.setItem("demo_rooms", JSON.stringify(INITIAL_ROOMS));
    return INITIAL_ROOMS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_ROOMS;
  }
};

const saveDemoRooms = (rooms) => {
  localStorage.setItem("demo_rooms", JSON.stringify(rooms));
};

const getDemoReservations = () => {
  const stored = localStorage.getItem("demo_reservations");
  if (!stored) {
    localStorage.setItem("demo_reservations", JSON.stringify(INITIAL_RESERVATIONS));
    return INITIAL_RESERVATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_RESERVATIONS;
  }
};

const saveDemoReservations = (res) => {
  localStorage.setItem("demo_reservations", JSON.stringify(res));
};

// Check if two date ranges overlap
const isDateOverlap = (checkIn1, checkOut1, checkIn2, checkOut2) => {
  if (!checkIn1 || !checkOut1 || !checkIn2 || !checkOut2) return false;
  return checkIn1 < checkOut2 && checkIn2 < checkOut1;
};

// Helper to catch connection errors and run fallback
const withFallback = async (apiCall, fallbackFn) => {
  try {
    return await apiCall();
  } catch (err) {
    // If backend responded with an HTTP status code (400, 401, 500, etc.), throw original error
    if (err.response) {
      throw err;
    }
    // Network / server unreachable: use client-side demo fallback
    console.warn("Backend server unreachable. Using Demo Fallback Mode.");
    return { data: fallbackFn() };
  }
};


// =====================================================
// AUTH
// =====================================================

export const loginUser = (data) =>
  withFallback(
    () => axios.post(`${AUTH_URL}/login`, data),
    () => {
      const input = (data.usernameOrEmail || "").trim().toLowerCase();
      const isAdmin = input.includes("admin");
      return {
        id: isAdmin ? 1 : Date.now(),
        username: data.usernameOrEmail || (isAdmin ? "admin" : "guest"),
        email: isAdmin ? "admin@grandhorizon.com" : `${data.usernameOrEmail || "guest"}@example.com`,
        role: isAdmin ? "ADMIN" : "USER"
      };
    }
  );

export const registerUser = (data) =>
  withFallback(
    () => axios.post(`${AUTH_URL}/register`, data),
    () => ({
      id: Date.now(),
      username: data.username,
      email: data.email,
      role: "USER"
    })
  );


// =====================================================
// RESERVATIONS
// =====================================================

export const getAllReservations = () =>
  withFallback(
    () => axios.get(RESERVATION_URL),
    () => getDemoReservations()
  );

export const getAll = getAllReservations;

export const getReservationsByGuest = (guestName) =>
  withFallback(
    () => axios.get(`${RESERVATION_URL}/guest/${encodeURIComponent(guestName)}`),
    () => getDemoReservations().filter((r) => r.guestName?.toLowerCase() === guestName?.toLowerCase())
  );

export const getReservationsByEmail = (email) =>
  withFallback(
    () => axios.get(`${RESERVATION_URL}/email/${encodeURIComponent(email)}`),
    () => getDemoReservations().filter((r) => r.email?.toLowerCase() === email?.toLowerCase())
  );

export const getReservationsByUser = (username) =>
  withFallback(
    () => axios.get(`${RESERVATION_URL}/user/${encodeURIComponent(username)}`),
    () =>
      getDemoReservations().filter(
        (r) =>
          (r.username || r.guestName)?.toLowerCase() === username?.toLowerCase()
      )
  );

export const createReservation = (data) =>
  withFallback(
    () => axios.post(RESERVATION_URL, data),
    () => {
      const current = getDemoReservations();

      // Check if room is already booked for overlapping dates
      const overlapping = current.find(
        (r) =>
          r.status !== "CANCELLED" &&
          String(r.roomNumber) === String(data.roomNumber) &&
          isDateOverlap(data.checkInDate, data.checkOutDate, r.checkInDate, r.checkOutDate)
      );

      if (overlapping) {
        const error = new Error(`Room ${data.roomNumber} is already booked from ${overlapping.checkInDate} to ${overlapping.checkOutDate}.`);
        error.response = {
          data: {
            message: `Room ${data.roomNumber} is already booked from ${overlapping.checkInDate} to ${overlapping.checkOutDate}.`
          }
        };
        throw error;
      }

      const newRes = {
        id: Date.now(),
        ...data,
        status: data.status || "CONFIRMED"
      };
      saveDemoReservations([newRes, ...current]);
      return newRes;
    }
  );

export const addReservation = createReservation;

export const getReservationById = (id) =>
  withFallback(
    () => axios.get(`${RESERVATION_URL}/${id}`),
    () => getDemoReservations().find((r) => String(r.id) === String(id)) || null
  );

export const updateReservation = (id, data) =>
  withFallback(
    () => axios.put(`${RESERVATION_URL}/${id}`, data),
    () => {
      const current = getDemoReservations();
      const updated = current.map((r) => (String(r.id) === String(id) ? { ...r, ...data } : r));
      saveDemoReservations(updated);
      return data;
    }
  );

export const updateReservationStatus = (id, status) =>
  withFallback(
    () => axios.patch(`${RESERVATION_URL}/${id}/status`, null, { params: { status } }),
    () => {
      const current = getDemoReservations();
      const updated = current.map((r) => (String(r.id) === String(id) ? { ...r, status } : r));
      saveDemoReservations(updated);
      return { id, status };
    }
  );

export const deleteReservation = (id) =>
  withFallback(
    () => axios.delete(`${RESERVATION_URL}/${id}`),
    () => {
      const current = getDemoReservations();
      saveDemoReservations(current.filter((r) => String(r.id) !== String(id)));
      return true;
    }
  );


// =====================================================
// AVAILABLE ROOMS FOR SELECTED DATES
// =====================================================

export const getAvailableRoomsForDates = (checkInDate, checkOutDate) =>
  withFallback(
    () =>
      axios.get(`${RESERVATION_URL}/available-rooms`, {
        params: { checkInDate, checkOutDate }
      }),
    () => {
      const rooms = getDemoRooms().filter((r) => r.available);
      const reservations = getDemoReservations().filter((r) => r.status !== "CANCELLED");

      // Filter out rooms that have an active reservation overlapping [checkInDate, checkOutDate]
      return rooms.filter((room) => {
        const hasOverlap = reservations.some(
          (res) =>
            String(res.roomNumber) === String(room.roomNumber) &&
            isDateOverlap(checkInDate, checkOutDate, res.checkInDate, res.checkOutDate)
        );
        return !hasOverlap;
      });
    }
  );


// =====================================================
// DOCUMENT UPLOAD
// =====================================================

export const uploadReservationDocument = (id, formData) =>
  withFallback(
    () =>
      axios.post(`${RESERVATION_URL}/${id}/upload-document`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      }),
    () => ({ documentUrl: "demo_guest_id.pdf" })
  );


// =====================================================
// ROOMS
// =====================================================

export const getAllRooms = () =>
  withFallback(
    () => axios.get(ROOM_URL),
    () => getDemoRooms()
  );

export const getAvailableRooms = () =>
  withFallback(
    () => axios.get(`${ROOM_URL}/available`),
    () => getDemoRooms().filter((r) => r.available)
  );

export const getRoomById = (id) =>
  withFallback(
    () => axios.get(`${ROOM_URL}/${id}`),
    () => getDemoRooms().find((r) => String(r.id) === String(id)) || null
  );

export const createRoom = (data) =>
  withFallback(
    () => axios.post(ROOM_URL, data),
    () => {
      const current = getDemoRooms();
      const newRoom = { id: Date.now(), ...data };
      saveDemoRooms([...current, newRoom]);
      return newRoom;
    }
  );

export const updateRoom = (id, data) =>
  withFallback(
    () => axios.put(`${ROOM_URL}/${id}`, data),
    () => {
      const current = getDemoRooms();
      const updated = current.map((r) => (String(r.id) === String(id) ? { ...r, ...data } : r));
      saveDemoRooms(updated);
      return data;
    }
  );

export const deleteRoom = (id) =>
  withFallback(
    () => axios.delete(`${ROOM_URL}/${id}`),
    () => {
      const current = getDemoRooms();
      saveDemoRooms(current.filter((r) => String(r.id) !== String(id)));
      return true;
    }
  );


// =====================================================
// ROOM IMAGE UPLOAD
// =====================================================

export const uploadRoomImage = (id, formData) =>
  withFallback(
    () =>
      axios.post(`${ROOM_URL}/${id}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      }),
    () => ({ imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" })
  );


// =====================================================
// FILE URL
// =====================================================

export const getFileUrl = (fileUrl) => {
  if (!fileUrl) return "";
  if (fileUrl.startsWith("http") || fileUrl.startsWith("data:")) {
    return fileUrl;
  }
  return `${BASE_URL}${fileUrl}`;
};