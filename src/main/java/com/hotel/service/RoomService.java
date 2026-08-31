package com.hotel.service;

import com.hotel.entity.Room;
import com.hotel.repository.RoomRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @PostConstruct
    public void initSampleRooms() {
        if (roomRepository.count() == 0) {
            roomRepository.save(new Room(
                    101,
                    "Deluxe Sea View Suite",
                    220.0,
                    2,
                    "AVAILABLE",
                    "Spacious suite with floor-to-ceiling ocean views, private balcony, marble bathroom, and luxury king bed.",
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
                    "WiFi, Air Conditioning, Ocean View, King Bed, Breakfast Included, Mini Bar"
            ));

            roomRepository.save(new Room(
                    102,
                    "Executive King Suite",
                    180.0,
                    2,
                    "AVAILABLE",
                    "Elegant executive suite featuring a dedicated work lounge, high-speed WiFi, smart automation, and plush bedding.",
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
                    "WiFi, Air Conditioning, City View, Smart TV, Workspace, Spa Access"
            ));

            roomRepository.save(new Room(
                    201,
                    "Presidential Royal Penthouse",
                    450.0,
                    4,
                    "AVAILABLE",
                    "The pinnacle of luxury: top-floor penthouse with private plunge pool, 360 panoramic views, and butler service.",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
                    "Private Pool, Butler Service, Ocean View, King Bed, Jacuzzi, Full Kitchen"
            ));

            roomRepository.save(new Room(
                    202,
                    "Garden Villa Suite",
                    280.0,
                    3,
                    "AVAILABLE",
                    "Tranquil villa setup surrounded by tropical botanical gardens with private patio and outdoor rain shower.",
                    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
                    "Garden View, Outdoor Patio, Rain Shower, Free Breakfast, King Bed"
            ));

            roomRepository.save(new Room(
                    301,
                    "Standard Twin Room",
                    120.0,
                    2,
                    "AVAILABLE",
                    "Comfortable twin room ideal for traveling friends or business companions, complete with premium amenities.",
                    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
                    "WiFi, Air Conditioning, Twin Beds, Coffee Maker, Work Desk"
            ));
        }
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus("AVAILABLE");
    }

    public Room getRoomById(int id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + id));
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(int id, Room roomDetails) {
        Room room = getRoomById(id);
        room.setRoomNumber(roomDetails.getRoomNumber());
        room.setRoomType(roomDetails.getRoomType());
        room.setPricePerNight(roomDetails.getPricePerNight());
        room.setCapacity(roomDetails.getCapacity());
        room.setStatus(roomDetails.getStatus());
        room.setDescription(roomDetails.getDescription());
        if (roomDetails.getImageUrl() != null && !roomDetails.getImageUrl().isEmpty()) {
            room.setImageUrl(roomDetails.getImageUrl());
        }
        room.setAmenities(roomDetails.getAmenities());
        return roomRepository.save(room);
    }

    public boolean deleteRoom(int id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
