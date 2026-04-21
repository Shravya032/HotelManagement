import axios from "axios";
const BASE_URL = "http://localhost:8080/reservations";

export const getAll = () => axios.get(BASE_URL);
export const addReservation = (data) => axios.post(BASE_URL, data);
export const deleteReservation = (id) => axios.delete(`${BASE_URL}/${id}`);
export const updateReservation = (id, data) => axios.put(`${BASE_URL}/${id}`, data);