package com.backend.farmersmarket.controller;

import java.sql.SQLException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.backend.farmersmarket.entity.LoginData;
import com.backend.farmersmarket.entity.userdata;
import com.backend.farmersmarket.service.OTPService;
import com.backend.farmersmarket.service.UserService;
import com.backend.farmersmarket.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = {
    "http://127.0.0.1:5501",
    "http://localhost:8000",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5501"
})
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private OTPService otpService;

    @Autowired
    
    private JwtUtil jwtUtil;
    private Map<String, LoginData> loginCache = new ConcurrentHashMap<>();

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody userdata user) {
        try {
            // Check if the email is already registered
            if (userService.isEmailRegistered(user.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Email is already registered."));
            }

            // Proceed with signup
            userService.signup(user);
            otpService.sendOTP(user.getEmail(), user.getUserType()); // Include userType when sending OTP
            return ResponseEntity.ok(Map.of("message", "OTP sent to your email."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Signup failed: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String userType = request.get("userType");
    
        System.out.println("Received OTP verification request:");
        System.out.println("Email: " + email);
        System.out.println("OTP: " + otp);
        System.out.println("User Type: " + userType);
    
        if (email == null || otp == null || userType == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email, OTP, and user type are required."));
        }
    
        if (otpService.verifyOTP(email, otp, userType)) {
            return ResponseEntity.ok(Map.of("message", "OTP verified. Please login."));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid OTP."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "username and password are required."));
        }

        Optional<userdata> user = userService.login(username, password);
        if (user.isPresent()) {
            String token = jwtUtil.generateToken(user.get().getUsername());
            String userType = user.get().getUserType();
            Long farmerId = user.get().getId();

            // // Store credentials with IP as key (for demo/testing)
            // String clientIP = httpRequest.getRemoteAddr();
            // loginCache.put(clientIP, new LoginData(username, password));

            return ResponseEntity.ok(Map.of(
                "token", token,
                "userType", userType,
                "farmerId", farmerId
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials."));
        }
    }
   @GetMapping("/consumerdata/{consumerid}")
    public ResponseEntity<?> consumerdata(@PathVariable("consumerid") Long id) {
        try {
            userdata data = userService.consumerdata(id);
            if (data == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Consumer data not found.");
            }
            return ResponseEntity.ok(data);
        } catch (NullPointerException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Null value encountered.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: ");
        }
    }
        // @GetMapping("/chatlogin")
    // public ResponseEntity<?> getLastLoginCredentials(HttpServletRequest httpRequest) {
    //     String clientIP = httpRequest.getRemoteAddr();
    //     LoginData loginData = loginCache.get(clientIP);

    //     if (loginData != null) {
    //         return ResponseEntity.ok(Map.of(
    //             "username", loginData.username,
    //             "password", loginData.password
    //         ));
    //     } else {
    //         return ResponseEntity.ok(Map.of("username", null, "password", null));
    //     }
    // }
    

}

