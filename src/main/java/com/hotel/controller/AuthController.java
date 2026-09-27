
package com.hotel.controller;

import com.hotel.entity.User;
import com.hotel.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {

            if (request.username == null || request.username.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createError("Username is required"));
            }

            if (request.email == null || request.email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createError("Email is required"));
            }

            if (request.password == null || request.password.length() < 6) {
                return ResponseEntity.badRequest()
                        .body(createError("Password must contain at least 6 characters"));
            }

            User user = authService.register(
                    request.username.trim(),
                    request.email.trim(),
                    request.password
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(createUserResponse(user));

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(createError(e.getMessage()));
        }
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {

            if (request.usernameOrEmail == null ||
                    request.usernameOrEmail.trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(createError("Username or email is required"));
            }

            if (request.password == null ||
                    request.password.isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(createError("Password is required"));
            }

            User user = authService.login(
                    request.usernameOrEmail.trim(),
                    request.password
            );

            return ResponseEntity.ok(createUserResponse(user));

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createError("Invalid username or password"));
        }
    }

    // =========================
    // USER RESPONSE
    // =========================
    private Map<String, Object> createUserResponse(User user) {

        Map<String, Object> response = new HashMap<>();

        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        // IMPORTANT:
        // Password is intentionally NOT returned.

        return response;
    }

    // =========================
    // ERROR RESPONSE
    // =========================
    private Map<String, String> createError(String message) {

        Map<String, String> response = new HashMap<>();

        response.put("message", message);

        return response;
    }

    // =========================
    // REGISTER REQUEST
    // =========================
    public static class RegisterRequest {

        public String username;
        public String email;
        public String password;
    }

    // =========================
    // LOGIN REQUEST
    // =========================
    public static class LoginRequest {

        public String usernameOrEmail;
        public String password;
    }
}

