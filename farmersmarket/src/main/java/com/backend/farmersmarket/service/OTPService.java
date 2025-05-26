package com.backend.farmersmarket.service;

import com.backend.farmersmarket.entity.OTP;
import com.backend.farmersmarket.repository.OTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OTPService {
    @Autowired
    private OTPRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void sendOTP(String email, String userType) {
        String otp = generateOTP();
        OTP otpEntity = new OTP();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // OTP expires in 5 minutes
        otpEntity.setUserType(userType); // Set the user type (farmer or customer)
        otpRepository.save(otpEntity);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("OTP Verification");
        message.setText("Your OTP is: " + otp);
        mailSender.send(message);
    }

    public boolean verifyOTP(String email, String otp, String userType) {
        Optional<OTP> otpEntity = otpRepository.findByEmailAndUserType(email, userType); // Find OTP by email and user type
        return otpEntity.isPresent() &&
                otpEntity.get().getOtp().equals(otp) &&
                otpEntity.get().getExpiryTime().isAfter(LocalDateTime.now());
    }

    private String generateOTP() {
        return String.format("%06d", new Random().nextInt(999999)); // Generate a 6-digit OTP
    }
}