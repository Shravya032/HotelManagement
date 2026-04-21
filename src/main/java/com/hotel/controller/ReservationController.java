package com.hotel.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hotel.entity.Reservation;
import com.hotel.service.ReservationService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService service;

    // CREATE
    @PostMapping
    public Reservation reserveRoom(@Valid @RequestBody Reservation r) {
        return service.reserveRoom(r);
    }

    // READ ALL
    @GetMapping
    public List<Reservation> getAll() {
        return service.getAllReservations();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Reservation getById(@PathVariable int id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable int id, @Valid @RequestBody Reservation r) {
        service.updateReservation(id, r);
        return ResponseEntity.ok("Updated successfully");
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        boolean deleted = service.deleteReservation(id);
        return deleted ? ResponseEntity.ok("Deleted successfully")
                       : ResponseEntity.notFound().build();
    }
}