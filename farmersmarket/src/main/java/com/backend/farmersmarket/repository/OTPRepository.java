package com.backend.farmersmarket.repository;

import com.backend.farmersmarket.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findByEmailAndUserType(String email, String userType); // Find OTP by email and user type
}