package com.hotel.controller;

import com.hotel.entity.Reservation;
import com.hotel.entity.Room;
import com.hotel.service.FileStorageService;
import com.hotel.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService service;

    @Autowired
    private FileStorageService fileStorageService;


    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {

        return ResponseEntity.ok(
                service.getAllReservations()
        );
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(
            @PathVariable int id) {

        try {

            return ResponseEntity.ok(
                    service.getReservationById(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(createError(e.getMessage()));
        }
    }


    // =========================================================
    // GET BY GUEST NAME
    // =========================================================

    @GetMapping("/guest/{guestName}")
    public ResponseEntity<List<Reservation>> getByGuest(
            @PathVariable String guestName) {

        return ResponseEntity.ok(
                service.getReservationsByGuest(guestName)
        );
    }


    // =========================================================
    // GET BY EMAIL
    // =========================================================

    @GetMapping("/email/{email}")
    public ResponseEntity<List<Reservation>> getByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                service.getReservationsByEmail(email)
        );
    }


    // =========================================================
    // GET BY USERNAME
    // =========================================================

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Reservation>> getByUser(
            @PathVariable String username) {

        return ResponseEntity.ok(
                service.getReservationsByUser(username)
        );
    }


    // =========================================================
    // GET AVAILABLE ROOMS FOR DATES
    // =========================================================

    @GetMapping("/available-rooms")
    public ResponseEntity<?> getAvailableRoomsForDates(
            @RequestParam String checkInDate,
            @RequestParam String checkOutDate) {

        try {

            List<Room> rooms =
                    service.getAvailableRoomsForDates(
                            checkInDate,
                            checkOutDate
                    );

            return ResponseEntity.ok(rooms);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(createError(e.getMessage()));
        }
    }


    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestBody Reservation reservation) {

        try {

            Reservation created =
                    service.createReservation(reservation);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(created);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(createError(e.getMessage()));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError(
                            "Unable to create reservation"
                    ));
        }
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(
            @PathVariable int id,
            @RequestBody Reservation reservation) {

        try {

            Reservation updated =
                    service.updateReservation(
                            id,
                            reservation
                    );

            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(createError(e.getMessage()));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(createError(e.getMessage()));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError(
                            "Unable to update reservation"
                    ));
        }
    }


    // =========================================================
    // UPDATE STATUS
    // =========================================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable int id,
            @RequestParam String status) {

        try {

            Reservation updated =
                    service.updateStatus(
                            id,
                            status
                    );

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(createError(e.getMessage()));
        }
    }


    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(
            @PathVariable int id) {

        try {

            service.deleteReservation(id);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Reservation deleted successfully"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(createError(e.getMessage()));
        }
    }


    // =========================================================
    // UPLOAD DOCUMENT
    // =========================================================

    @PostMapping("/{id}/upload-document")
    public ResponseEntity<?> uploadDocument(
            @PathVariable int id,
            @RequestParam("file") MultipartFile file) {

        try {

            String fileUrl =
                    fileStorageService.storeFile(file);

            Reservation reservation =
                    service.getReservationById(id);

            reservation.setDocumentUrl(fileUrl);

            Reservation updated =
                    service.updateReservation(
                            id,
                            reservation
                    );

            return ResponseEntity.ok(updated);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError(
                            "Unable to upload document"
                    ));
        }
    }


    // =========================================================
    // ERROR RESPONSE
    // =========================================================

    private Map<String, String> createError(
            String message) {

        Map<String, String> response =
                new HashMap<>();

        response.put(
                "message",
                message == null
                        ? "Unknown error"
                        : message
        );

        return response;
    }
}