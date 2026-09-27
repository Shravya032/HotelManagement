package com.hotel.repository;

import com.hotel.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    List<Reservation> findByGuestName(String guestName);

    List<Reservation> findByGuestEmail(String guestEmail);

    List<Reservation> findByOwnerUsername(String ownerUsername);

    @Query("""
        SELECT r
        FROM Reservation r
        WHERE r.roomNumber = :roomNumber
        AND r.status <> 'CANCELLED'
        AND r.checkInDate < :checkOutDate
        AND r.checkOutDate > :checkInDate
    """)
    List<Reservation> findOverlappingReservations(
            @Param("roomNumber") int roomNumber,
            @Param("checkInDate") String checkInDate,
            @Param("checkOutDate") String checkOutDate
    );
}