package com.hotel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reservationId;

    @NotBlank(message = "Guest name cannot be empty")
    @Column(name = "guest_name")
    private String guestName;

    @Min(value = 1, message = "Room number must be greater than 0")
    @Column(name = "room_number")
    private int roomNumber;

    @NotBlank(message = "Contact number cannot be empty")
    @Pattern(regexp = "\\d{10}", message = "Contact must be 10 digits")
    @Column(name = "contact_number")
    private String contactNumber;

    // Getters & Setters

    public int getReservationId() {
        return reservationId;
    }

    public void setReservationId(int reservationId) {
        this.reservationId = reservationId;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public int getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(int roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }
}