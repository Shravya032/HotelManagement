package com.hotel.controller;

import com.hotel.entity.Reservation;
import com.hotel.service.FileStorageService;
import com.hotel.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService service;

    @Autowired
    private FileStorageService fileStorageService;

    // CREATE
    @PostMapping
    public ResponseEntity<Reservation> reserveRoom(@RequestBody Reservation r) {
        Reservation created = service.reserveRoom(r);
        return ResponseEntity.ok(created);
    }

    // READ ALL
    @GetMapping
    public List<Reservation> getAll() {
        return service.getAllReservations();
    }

    // READ BY GUEST NAME
    @GetMapping("/guest/{name}")
    public List<Reservation> getByGuest(@PathVariable String name) {
        return service.getReservationsByGuest(name);
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getById(@PathVariable int id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // UPDATE DETAILS
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> update(@PathVariable int id, @RequestBody Reservation r) {
        Reservation updated = service.updateReservation(id, r);
        return ResponseEntity.ok(updated);
    }

    // UPDATE STATUS (Check-In, Check-Out, Cancel, Confirm)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Reservation> updateStatus(@PathVariable int id, @RequestParam String status) {
        Reservation updated = service.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    // UPLOAD DOCUMENT (ID Proof / Voucher attachment)
    @PostMapping("/{id}/upload-document")
    public ResponseEntity<Reservation> uploadDocument(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        Reservation updated = service.updateDocument(id, fileUrl);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        boolean deleted = service.deleteReservation(id);
        return deleted ? ResponseEntity.ok("Reservation deleted successfully")
                       : ResponseEntity.notFound().build();
    }
}