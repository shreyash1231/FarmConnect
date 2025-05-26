package com.backend.farmersmarket.repository;

import com.backend.farmersmarket.entity.userdata;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<userdata, Long> {
    Optional<userdata> findByUsername(String username);
    Optional<userdata> findByEmail(String email);
}