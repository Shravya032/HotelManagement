package com.hotel.service;

import com.hotel.entity.Reservation;
import com.hotel.entity.Room;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository;


    // =========================================================
    // GET ALL RESERVATIONS
    // =========================================================

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }


    // =========================================================
    // GET RESERVATION BY ID
    // =========================================================

    public Reservation getReservationById(int id) {
        return reservationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Reservation not found with ID: " + id));
    }


    // =========================================================
    // GET RESERVATIONS BY GUEST NAME
    // =========================================================

    public List<Reservation> getReservationsByGuest(String guestName) {
        return reservationRepository.findByGuestName(guestName);
    }


    // =========================================================
    // GET RESERVATIONS BY EMAIL
    // =========================================================

    public List<Reservation> getReservationsByEmail(String email) {
        return reservationRepository.findByGuestEmail(email);
    }


    // =========================================================
    // GET RESERVATIONS BY USERNAME
    // =========================================================

    public List<Reservation> getReservationsByUser(String username) {
        return reservationRepository.findByOwnerUsername(username);
    }


    // =========================================================
    // DATE VALIDATION
    // =========================================================

    private void validateDates(Reservation reservation) {

        if (reservation.getCheckInDate() == null ||
                reservation.getCheckInDate().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Check-in date is required"
            );
        }

        if (reservation.getCheckOutDate() == null ||
                reservation.getCheckOutDate().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Check-out date is required"
            );
        }

        if (reservation.getRoomNumber() <= 0) {

            throw new IllegalArgumentException(
                    "Valid room number is required"
            );
        }

        try {

            LocalDate checkIn =
                    LocalDate.parse(reservation.getCheckInDate());

            LocalDate checkOut =
                    LocalDate.parse(reservation.getCheckOutDate());

            if (!checkOut.isAfter(checkIn)) {

                throw new IllegalArgumentException(
                        "Check-out date must be after check-in date"
                );
            }

        } catch (DateTimeParseException e) {

            throw new IllegalArgumentException(
                    "Dates must be in yyyy-MM-dd format"
            );
        }
    }


    // =========================================================
    // CHECK ROOM AVAILABILITY
    // =========================================================

    public boolean isRoomAvailable(
            int roomNumber,
            String checkInDate,
            String checkOutDate,
            Integer reservationId) {

        List<Reservation> overlapping =
                reservationRepository.findOverlappingReservations(
                        roomNumber,
                        checkInDate,
                        checkOutDate
                );

        for (Reservation reservation : overlapping) {

            // Ignore the same reservation while editing
            if (reservationId != null &&
                    reservation.getReservationId() == reservationId) {

                continue;
            }

            return false;
        }

        return true;
    }


    // =========================================================
    // CREATE RESERVATION
    // =========================================================

    public Reservation createReservation(Reservation reservation) {

        validateDates(reservation);

        if (reservation.getOwnerUsername() == null ||
                reservation.getOwnerUsername().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Owner username is required"
            );
        }

        reservation.setOwnerUsername(
                reservation.getOwnerUsername().trim()
        );

        // Check whether room exists
        Room room = roomRepository
                .findByRoomNumber(reservation.getRoomNumber())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Room " + reservation.getRoomNumber()
                                        + " does not exist"
                        )
                );

        // Room under maintenance cannot be booked
        if ("MAINTENANCE".equalsIgnoreCase(room.getStatus())) {

            throw new IllegalArgumentException(
                    "Room " + room.getRoomNumber()
                            + " is currently under maintenance"
            );
        }

        // Check overlapping reservation
        if (!isRoomAvailable(
                reservation.getRoomNumber(),
                reservation.getCheckInDate(),
                reservation.getCheckOutDate(),
                null)) {

            throw new IllegalArgumentException(
                    "Room " + reservation.getRoomNumber()
                            + " is already booked for the selected dates"
            );
        }

        if (reservation.getStatus() == null ||
                reservation.getStatus().trim().isEmpty()) {

            reservation.setStatus("CONFIRMED");
        }

        return reservationRepository.save(reservation);
    }


    // =========================================================
    // UPDATE RESERVATION
    // =========================================================

    public Reservation updateReservation(
            int id,
            Reservation details) {

        validateDates(details);

        Reservation existing =
                reservationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Reservation not found with ID: " + id
                                )
                        );

        // Keep old owner username if the frontend doesn't send it
        String ownerUsername = details.getOwnerUsername();

        if (ownerUsername == null ||
                ownerUsername.trim().isEmpty()) {

            ownerUsername = existing.getOwnerUsername();
        }

        if (ownerUsername == null ||
                ownerUsername.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Owner username is required"
            );
        }

        // Check room exists
        Room room = roomRepository
                .findByRoomNumber(details.getRoomNumber())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Room " + details.getRoomNumber()
                                        + " does not exist"
                        )
                );

        // Check maintenance
        if ("MAINTENANCE".equalsIgnoreCase(room.getStatus())) {

            throw new IllegalArgumentException(
                    "Room " + room.getRoomNumber()
                            + " is currently under maintenance"
            );
        }

        // Check overlapping reservation
        if (!isRoomAvailable(
                details.getRoomNumber(),
                details.getCheckInDate(),
                details.getCheckOutDate(),
                id)) {

            throw new IllegalArgumentException(
                    "Room " + details.getRoomNumber()
                            + " is already booked for the selected dates"
            );
        }

        existing.setOwnerUsername(ownerUsername.trim());

        existing.setGuestName(details.getGuestName());
        existing.setGuestEmail(details.getGuestEmail());

        existing.setRoomNumber(details.getRoomNumber());
        existing.setRoomType(details.getRoomType());

        existing.setContactNumber(details.getContactNumber());

        existing.setCheckInDate(details.getCheckInDate());
        existing.setCheckOutDate(details.getCheckOutDate());

        existing.setTotalPrice(details.getTotalPrice());

        existing.setStatus(
                details.getStatus() == null ||
                        details.getStatus().trim().isEmpty()
                        ? "CONFIRMED"
                        : details.getStatus()
        );

        existing.setSpecialRequests(details.getSpecialRequests());

        // Preserve existing document if no new document is supplied
        if (details.getDocumentUrl() != null &&
                !details.getDocumentUrl().trim().isEmpty()) {

            existing.setDocumentUrl(details.getDocumentUrl());
        }

        return reservationRepository.save(existing);
    }


    // =========================================================
    // UPDATE STATUS
    // =========================================================

    public Reservation updateStatus(
            int id,
            String status) {

        Reservation reservation =
                reservationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Reservation not found with ID: " + id
                                )
                        );

        if (status == null ||
                status.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Status is required"
            );
        }

        reservation.setStatus(status);

        return reservationRepository.save(reservation);
    }


    // =========================================================
    // DELETE RESERVATION
    // =========================================================

    public void deleteReservation(int id) {

        if (!reservationRepository.existsById(id)) {

            throw new RuntimeException(
                    "Reservation not found with ID: " + id
            );
        }

        reservationRepository.deleteById(id);
    }


    // =========================================================
    // GET AVAILABLE ROOMS FOR SELECTED DATES
    // =========================================================

    public List<Room> getAvailableRoomsForDates(
            String checkInDate,
            String checkOutDate) {

        if (checkInDate == null ||
                checkInDate.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Check-in date is required"
            );
        }

        if (checkOutDate == null ||
                checkOutDate.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Check-out date is required"
            );
        }

        try {

            LocalDate checkIn =
                    LocalDate.parse(checkInDate);

            LocalDate checkOut =
                    LocalDate.parse(checkOutDate);

            if (!checkOut.isAfter(checkIn)) {

                throw new IllegalArgumentException(
                        "Check-out date must be after check-in date"
                );
            }

        } catch (DateTimeParseException e) {

            throw new IllegalArgumentException(
                    "Dates must be in yyyy-MM-dd format"
            );
        }

        List<Room> availableRooms =
                roomRepository.findByStatus("AVAILABLE");

        return availableRooms.stream()
                .filter(room ->
                        isRoomAvailable(
                                room.getRoomNumber(),
                                checkInDate,
                                checkOutDate,
                                null
                        )
                )
                .collect(Collectors.toList());
    }
}