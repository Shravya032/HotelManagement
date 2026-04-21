package com.hotel.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hotel.entity.Reservation;
import com.hotel.repository.ReservationRepository;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository repo;

    public Reservation reserveRoom(Reservation r) {
        return repo.save(r);
    }

    public List<Reservation> getAllReservations() {
        return repo.findAll();
    }

    public Reservation getById(int id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    public Reservation updateReservation(int id, Reservation r) {
        Reservation existing = getById(id);

        existing.setGuestName(r.getGuestName());
        existing.setRoomNumber(r.getRoomNumber());
        existing.setContactNumber(r.getContactNumber());

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