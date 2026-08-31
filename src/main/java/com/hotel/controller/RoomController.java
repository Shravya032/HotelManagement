package com.hotel.controller;

import com.hotel.entity.Room;
import com.hotel.service.FileStorageService;
import com.hotel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/available")
    public List<Room> getAvailableRooms() {
        return roomService.getAvailableRooms();
    }

    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable int id) {
        return roomService.getRoomById(id);
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room created = roomService.saveRoom(room);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable int id, @RequestBody Room roomDetails) {
        Room updated = roomService.updateRoom(id, roomDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable int id) {
        boolean deleted = roomService.deleteRoom(id);
        return deleted ? ResponseEntity.ok("Room deleted successfully")
                       : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<Room> uploadRoomImage(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        Room room = roomService.getRoomById(id);
        room.setImageUrl(fileUrl);
        Room updated = roomService.saveRoom(room);
        return ResponseEntity.ok(updated);
    }
}
