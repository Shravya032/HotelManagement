
package com.hotel.service;

import com.hotel.entity.User;
import com.hotel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // =========================
    // REGISTER USER
    // =========================
    public User register(String username, String email, String password) {

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setUsername(username);
        user.setEmail(email);

        // Store only encrypted password
        user.setPassword(passwordEncoder.encode(password));

        // Normal registration can ONLY create USER
        user.setRole("USER");

        return userRepository.save(user);
    }

    // =========================
    // LOGIN
    // =========================
    public User login(String usernameOrEmail, String password) {

        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() ->
                        userRepository.findByEmail(usernameOrEmail)
                                .orElse(null)
                );

        if (user == null) {
            throw new RuntimeException("Invalid username or password");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }
}

