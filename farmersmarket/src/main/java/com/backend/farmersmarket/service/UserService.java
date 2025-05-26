package com.backend.farmersmarket.service;

import com.backend.farmersmarket.entity.userdata;
import com.backend.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean isEmailRegistered(String email) {
        return userRepository.findByUsername(email).isPresent(); // Check if email exists
    }

    public userdata signup(userdata user1) {
        if (isEmailRegistered(user1.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }
        user1.setPassword(passwordEncoder.encode(user1.getPassword()));
        return userRepository.save(user1);
    }

    public Optional<userdata> login(String username, String password) {
        Optional<userdata> user1 = userRepository.findByUsername(username);
        if (user1.isPresent() && passwordEncoder.matches(password, user1.get().getPassword())) {
            return user1;
        }
        return Optional.empty();
    }
}