package com.hotel.service;

import com.hotel.entity.Reservation;
import com.hotel.repository.ReservationRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository repo;

    @PostConstruct
    public void initSampleReservations() {
        if (repo.count() == 0) {
            repo.save(new Reservation(
                    "Sarah Jenkins",
                    "sarah.j@example.com",
                    101,
                    "Deluxe Sea View Suite",
                    "9876543210",
                    "2026-09-10",
                    "2026-09-15",
                    1100.0,
                    "CONFIRMED",
                    "Late check-in requested (after 8 PM)."
            ));

            repo.save(new Reservation(
                    "Michael Vance",
                    "m.vance@example.com",
                    102,
                    "Executive King Suite",
                    "9123456789",
                    "2026-09-12",
                    "2026-09-14",
                    360.0,
                    "CHECKED_IN",
                    "High floor, away from elevator."
            ));

            repo.save(new Reservation(
                    "Emma Watson",
                    "emma.w@example.com",
                    201,
                    "Presidential Royal Penthouse",
                    "9988776655",
                    "2026-09-20",
                    "2026-09-23",
                    1350.0,
                    "PENDING",
                    "Champagne package on arrival."
            ));
        }
    }

    public Reservation reserveRoom(Reservation r) {
        if (r.getStatus() == null || r.getStatus().isEmpty()) {
            r.setStatus("CONFIRMED");
        }
        return repo.save(r);
    }

    public List<Reservation> getAllReservations() {
        return repo.findAll();
    }

    public List<Reservation> getReservationsByGuest(String guestName) {
        return repo.findByGuestNameContainingIgnoreCase(guestName);
    }

    public Reservation getById(int id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));
    }

    public Reservation updateReservation(int id, Reservation r) {
        Reservation existing = getById(id);

        if (r.getGuestName() != null) existing.setGuestName(r.getGuestName());
        if (r.getGuestEmail() != null) existing.setGuestEmail(r.getGuestEmail());
        if (r.getRoomNumber() != 0) existing.setRoomNumber(r.getRoomNumber());
        if (r.getRoomType() != null) existing.setRoomType(r.getRoomType());
        if (r.getContactNumber() != null) existing.setContactNumber(r.getContactNumber());
        if (r.getCheckInDate() != null) existing.setCheckInDate(r.getCheckInDate());
        if (r.getCheckOutDate() != null) existing.setCheckOutDate(r.getCheckOutDate());
        if (r.getTotalPrice() > 0) existing.setTotalPrice(r.getTotalPrice());
        if (r.getStatus() != null) existing.setStatus(r.getStatus());
        if (r.getSpecialRequests() != null) existing.setSpecialRequests(r.getSpecialRequests());
        if (r.getDocumentUrl() != null) existing.setDocumentUrl(r.getDocumentUrl());

        return repo.save(existing);
    }

    public Reservation updateStatus(int id, String newStatus) {
        Reservation existing = getById(id);
        existing.setStatus(newStatus);
        return repo.save(existing);
    }

    public Reservation updateDocument(int id, String documentUrl) {
        Reservation existing = getById(id);
        existing.setDocumentUrl(documentUrl);
        return repo.save(existing);
    }

    public boolean deleteReservation(int id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}