
package com.hotel.config;

import com.hotel.entity.User;
import com.hotel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (!userRepository.existsByUsername("admin")) {

            User admin = new User();

            admin.setUsername("admin");
            admin.setEmail("admin@grandhotel.com");

            // Admin password
            admin.setPassword(passwordEncoder.encode("Admin@123"));

            admin.setRole("ADMIN");

            userRepository.save(admin);

            System.out.println("=================================");
            System.out.println("Admin account created successfully");
            System.out.println("Username: admin");
            System.out.println("Password: Admin@123");
            System.out.println("=================================");

        } else {
            System.out.println("Admin account already exists.");
        }
    }
}
