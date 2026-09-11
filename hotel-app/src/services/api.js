import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Fallback Mock Data Store for deployed/offline environment (e.g. Vercel static hosting)
const MOCK_ROOMS_KEY = "hotel_rooms_mock_data";
const MOCK_RESERVATIONS_KEY = "hotel_reservations_mock_data";

export const DEFAULT_ROOMS = [
  {
    id: 101,
    roomId: 101,
    roomNumber: 101,
    roomType: "Deluxe Sea View Suite",
    pricePerNight: 220.0,
    capacity: 2,
    status: "AVAILABLE",
    description: "Spacious suite with floor-to-ceiling ocean views, private balcony, marble bathroom, and luxury king bed.",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    amenities: "WiFi, Air Conditioning, Ocean View, King Bed, Breakfast Included, Mini Bar"
  },
  {
    id: 102,
    roomId: 102,
    roomNumber: 102,
    roomType: "Executive King Suite",
    pricePerNight: 180.0,
    capacity: 2,
    status: "AVAILABLE",
    description: "Elegant executive suite featuring a dedicated work lounge, high-speed WiFi, smart automation, and plush bedding.",
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    amenities: "WiFi, Air Conditioning, City View, Smart TV, Workspace, Spa Access"
  },
  {
    id: 201,
    roomId: 201,
    roomNumber: 201,
    roomType: "Presidential Royal Penthouse",
    pricePerNight: 450.0,
    capacity: 4,
    status: "AVAILABLE",
    description: "The pinnacle of luxury: top-floor penthouse with private plunge pool, 360 panoramic views, and butler service.",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    amenities: "Private Pool, Butler Service, Ocean View, King Bed, Jacuzzi, Full Kitchen"
  },
  {
    id: 202,
    roomId: 202,
    roomNumber: 202,
    roomType: "Garden Villa Suite",
    pricePerNight: 280.0,
    capacity: 3,
    status: "AVAILABLE",
    description: "Tranquil villa setup surrounded by tropical botanical gardens with private patio and outdoor rain shower.",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    amenities: "Garden View, Outdoor Patio, Rain Shower, Free Breakfast, King Bed"
  },
  {
    id: 301,
    roomId: 301,
    roomNumber: 301,
    roomType: "Standard Twin Room",
    pricePerNight: 120.0,
    capacity: 2,
    status: "AVAILABLE",
    description: "Comfortable twin room ideal for traveling friends or business companions, complete with premium amenities.",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    amenities: "WiFi, Air Conditioning, Twin Beds, Coffee Maker, Work Desk"
  }
];

const DEFAULT_RESERVATIONS = [
  {
    id: 1,
    reservationId: 1,
    guestName: "Admin User",
    guestEmail: "admin@grandhotel.com",
    contactNumber: "9876543210",
    roomNumber: 101,
    roomType: "Deluxe Sea View Suite",
    checkInDate: "2026-09-15",
    checkOutDate: "2026-09-18",
    totalPrice: 660.0,
    status: "CONFIRMED",
    specialRequests: "High floor requested",
    documentUrl: ""
  }
];

const normalizeRoom = (r) => {
  if (!r) return r;
  const id = r.roomId || r.id || r.roomNumber;
  return { ...r, id, roomId: id };
};

const normalizeReservation = (res) => {
  if (!res) return res;
  const id = res.reservationId || res.id;
  return { ...res, id, reservationId: id };
};

const getStoredRooms = () => {
  try {
    const data = localStorage.getItem(MOCK_ROOMS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeRoom);
      }
    }
  } catch (e) {}
  localStorage.setItem(MOCK_ROOMS_KEY, JSON.stringify(DEFAULT_ROOMS));
  return DEFAULT_ROOMS.map(normalizeRoom);
};

const saveStoredRooms = (rooms) => {
  try {
    const normalized = rooms.map(normalizeRoom);
    localStorage.setItem(MOCK_ROOMS_KEY, JSON.stringify(normalized));
  } catch (e) {}
};

const getStoredReservations = () => {
  try {
    const data = localStorage.getItem(MOCK_RESERVATIONS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeReservation);
      }
    }
  } catch (e) {}
  localStorage.setItem(MOCK_RESERVATIONS_KEY, JSON.stringify(DEFAULT_RESERVATIONS));
  return DEFAULT_RESERVATIONS.map(normalizeReservation);
};

const saveStoredReservations = (res) => {
  try {
    const normalized = res.map(normalizeReservation);
    localStorage.setItem(MOCK_RESERVATIONS_KEY, JSON.stringify(normalized));
  } catch (e) {}
};

// ROOM API ENDPOINTS
export const getAllRooms = async () => {
  try {
    const response = await api.get("/api/rooms");
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const normalized = response.data.map(normalizeRoom);
      saveStoredRooms(normalized);
      return { ...response, data: normalized };
    }
    return { data: getStoredRooms() };
  } catch (err) {
    console.warn("Backend API unavailable. Returning local fallback room catalog.", err.message);
    return { data: getStoredRooms() };
  }
};

export const getAvailableRooms = async () => {
  try {
    const response = await api.get("/api/rooms/available");
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const normalized = response.data.map(normalizeRoom);
      return { ...response, data: normalized };
    }
    const all = getStoredRooms();
    const available = all.filter((r) => r.status === "AVAILABLE");
    return { data: available };
  } catch (err) {
    console.warn("Backend API unavailable. Returning local available rooms.", err.message);
    const all = getStoredRooms();
    const available = all.filter((r) => r.status === "AVAILABLE");
    return { data: available };
  }
};

export const getRoomById = async (id) => {
  try {
    const res = await api.get(`/api/rooms/${id}`);
    return { ...res, data: normalizeRoom(res.data) };
  } catch (err) {
    const rooms = getStoredRooms();
    const room = rooms.find((r) => r.id === parseInt(id) || r.roomId === parseInt(id) || r.roomNumber === parseInt(id));
    return { data: room || rooms[0] };
  }
};

export const createRoom = async (data) => {
  try {
    const res = await api.post("/api/rooms", data);
    return { ...res, data: normalizeRoom(res.data) };
  } catch (err) {
    console.warn("Backend API unavailable. Creating room locally.", err.message);
    const rooms = getStoredRooms();
    const newId = Date.now();
    const newRoom = normalizeRoom({
      id: newId,
      roomId: newId,
      roomNumber: parseInt(data.roomNumber) || Math.floor(Math.random() * 800) + 100,
      roomType: data.roomType || "Deluxe Suite",
      pricePerNight: parseFloat(data.pricePerNight) || 150,
      capacity: parseInt(data.capacity) || 2,
      status: data.status || "AVAILABLE",
      description: data.description || "",
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      amenities: data.amenities || "WiFi, Air Conditioning, TV"
    });
    rooms.unshift(newRoom);
    saveStoredRooms(rooms);
    return { data: newRoom };
  }
};

export const updateRoom = async (id, data) => {
  try {
    const res = await api.put(`/api/rooms/${id}`, data);
    return { ...res, data: normalizeRoom(res.data) };
  } catch (err) {
    console.warn("Backend API unavailable. Updating room locally.", err.message);
    const rooms = getStoredRooms();
    const targetId = parseInt(id);
    const index = rooms.findIndex((r) => r.id === targetId || r.roomId === targetId || r.roomNumber === targetId);
    if (index !== -1) {
      rooms[index] = normalizeRoom({ ...rooms[index], ...data });
      saveStoredRooms(rooms);
      return { data: rooms[index] };
    }
    return { data: normalizeRoom(data) };
  }
};

export const deleteRoom = async (id) => {
  try {
    return await api.delete(`/api/rooms/${id}`);
  } catch (err) {
    console.warn("Backend API unavailable. Deleting room locally.", err.message);
    let rooms = getStoredRooms();
    const targetId = parseInt(id);
    rooms = rooms.filter((r) => r.id !== targetId && r.roomId !== targetId && r.roomNumber !== targetId);
    saveStoredRooms(rooms);
    return { data: { success: true } };
  }
};

export const uploadRoomImage = async (id, formData) => {
  try {
    return await api.post(`/api/rooms/${id}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    const mockUrl = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";
    const rooms = getStoredRooms();
    const room = rooms.find((r) => r.id === parseInt(id) || r.roomId === parseInt(id));
    if (room) {
      room.imageUrl = mockUrl;
      saveStoredRooms(rooms);
    }
    return { data: { imageUrl: mockUrl } };
  }
};

// RESERVATION API ENDPOINTS
export const getAllReservations = async () => {
  try {
    const response = await api.get("/reservations");
    if (response.data && Array.isArray(response.data)) {
      const normalized = response.data.map(normalizeReservation);
      saveStoredReservations(normalized);
      return { ...response, data: normalized };
    }
    return { data: getStoredReservations() };
  } catch (err) {
    console.warn("Backend API unavailable. Returning local fallback reservations.", err.message);
    return { data: getStoredReservations() };
  }
};

export const getReservationsByGuest = async (guestName) => {
  try {
    const response = await api.get(`/reservations/guest/${encodeURIComponent(guestName)}`);
    if (response.data && Array.isArray(response.data)) {
      return { ...response, data: response.data.map(normalizeReservation) };
    }
    const reservations = getStoredReservations();
    return { data: reservations };
  } catch (err) {
    const reservations = getStoredReservations();
    return { data: reservations };
  }
};

export const getReservationById = async (id) => {
  try {
    const res = await api.get(`/reservations/${id}`);
    return { ...res, data: normalizeReservation(res.data) };
  } catch (err) {
    const reservations = getStoredReservations();
    const res = reservations.find((r) => r.id === parseInt(id) || r.reservationId === parseInt(id));
    return { data: res || reservations[0] };
  }
};

export const createReservation = async (data) => {
  try {
    const res = await api.post("/reservations", data);
    return { ...res, data: normalizeReservation(res.data) };
  } catch (err) {
    console.warn("Backend API unavailable. Creating reservation locally.", err.message);
    const reservations = getStoredReservations();
    const newId = Date.now();
    const newRes = normalizeReservation({
      id: newId,
      reservationId: newId,
      guestName: data.guestName || "Guest User",
      guestEmail: data.guestEmail || "guest@example.com",
      contactNumber: data.contactNumber || "9876543210",
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      totalPrice: data.totalPrice,
      status: data.status || "CONFIRMED",
      specialRequests: data.specialRequests || "",
      documentUrl: ""
    });
    reservations.unshift(newRes);
    saveStoredReservations(reservations);
    return { data: newRes };
  }
};

export const updateReservation = async (id, data) => {
  try {
    const res = await api.put(`/reservations/${id}`, data);
    return { ...res, data: normalizeReservation(res.data) };
  } catch (err) {
    const reservations = getStoredReservations();
    const targetId = parseInt(id);
    const index = reservations.findIndex((r) => r.id === targetId || r.reservationId === targetId);
    if (index !== -1) {
      reservations[index] = normalizeReservation({ ...reservations[index], ...data });
      saveStoredReservations(reservations);
      return { data: reservations[index] };
    }
    return { data: normalizeReservation(data) };
  }
};

export const updateReservationStatus = async (id, status) => {
  try {
    const res = await api.patch(`/reservations/${id}/status?status=${encodeURIComponent(status)}`);
    return { ...res, data: normalizeReservation(res.data) };
  } catch (err) {
    const reservations = getStoredReservations();
    const targetId = parseInt(id);
    const index = reservations.findIndex((r) => r.id === targetId || r.reservationId === targetId);
    if (index !== -1) {
      reservations[index].status = status;
      saveStoredReservations(reservations);
      return { data: reservations[index] };
    }
    return { data: { success: true } };
  }
};

export const uploadReservationDocument = async (id, formData) => {
  try {
    return await api.post(`/reservations/${id}/upload-document`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    const mockDoc = "id_proof_document.pdf";
    const reservations = getStoredReservations();
    const targetId = parseInt(id);
    const res = reservations.find((r) => r.id === targetId || r.reservationId === targetId);
    if (res) {
      res.documentUrl = mockDoc;
      saveStoredReservations(reservations);
    }
    return { data: { documentUrl: mockDoc } };
  }
};

export const deleteReservation = async (id) => {
  try {
    return await api.delete(`/reservations/${id}`);
  } catch (err) {
    let reservations = getStoredReservations();
    const targetId = parseInt(id);
    reservations = reservations.filter((r) => r.id !== targetId && r.reservationId !== targetId);
    saveStoredReservations(reservations);
    return { data: { success: true } };
  }
};

// FILE UPLOAD API
export const uploadFile = async (formData) => {
  try {
    return await api.post("/api/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    return { data: { fileUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" } };
  }
};

export const getFileUrl = (relativeUrl) => {
  if (!relativeUrl) return "";
  if (relativeUrl.startsWith("http")) return relativeUrl;
  return `${API_BASE_URL}${relativeUrl}`;
};

export default api;