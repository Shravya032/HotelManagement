package com.hotel.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hotel.entity.Reservation;
import com.hotel.service.FileStorageService;
import com.hotel.service.ReservationService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService service;

    @Autowired
    private FileStorageService fileStorageService;

    // =========================================================
    // CREATE RESERVATION
    // =========================================================

    @PostMapping
    public ResponseEntity<Reservation> reserveRoom(
            @RequestBody Reservation r) {

        Reservation created = service.reserveRoom(r);

        return ResponseEntity.ok(created);
    }

    // =========================================================
    // GET ALL RESERVATIONS
    // ADMIN ONLY
    // =========================================================

    @GetMapping
    public List<Reservation> getAll() {

        return service.getAllReservations();
    }

    // =========================================================
    // GET RESERVATIONS FOR ONE USER
    // USER
    // Example:
    // /reservations/guest/Shravya
    // =========================================================

    @GetMapping("/guest/{name}")
    public List<Reservation> getByGuest(
            @PathVariable String name) {

        return service.getReservationsByGuest(name);
    }

    // =========================================================
    // GET RESERVATIONS BY EMAIL
    // =========================================================

    @GetMapping("/email/{email}")
    public List<Reservation> getByEmail(
            @PathVariable String email) {

        return service.getReservationsByEmail(email);
    }

    // =========================================================
    // GET RESERVATION BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getById(
            @PathVariable int id) {

        return ResponseEntity.ok(service.getById(id));
    }

    // =========================================================
    // UPDATE RESERVATION
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> update(
            @PathVariable int id,
            @RequestBody Reservation r) {

        Reservation updated =
                service.updateReservation(id, r);

        return ResponseEntity.ok(updated);
    }

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<Reservation> updateStatus(
            @PathVariable int id,
            @RequestParam String status) {

        Reservation updated =
                service.updateStatus(id, status);

        return ResponseEntity.ok(updated);
    }

    // =========================================================
    // UPLOAD DOCUMENT
    // =========================================================

    @PostMapping("/{id}/upload-document")
    public ResponseEntity<Reservation> uploadDocument(
            @PathVariable int id,
            @RequestParam("file") MultipartFile file) {

        String fileUrl =
                fileStorageService.storeFile(file);

        Reservation updated =
                service.updateDocument(id, fileUrl);

        return ResponseEntity.ok(updated);
    }

    // =========================================================
    // DELETE RESERVATION
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable int id) {

        boolean deleted =
                service.deleteReservation(id);

        if (deleted) {
            return ResponseEntity.ok(
                    "Reservation deleted successfully"
            );
        }

        return ResponseEntity.notFound().build();
    }
}