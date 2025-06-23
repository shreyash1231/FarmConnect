package com.backend.farmersmarket.service;

import com.backend.farmersmarket.entity.Crop;
import com.backend.farmersmarket.entity.OrderDetailsDTO;
import com.backend.farmersmarket.entity.Payment;
import com.backend.farmersmarket.entity.userdata;
import com.backend.farmersmarket.repository.CropRepository;
import com.backend.farmersmarket.repository.PaymentRepository;
import com.backend.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CropRepository cropRepository;

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

    public userdata consumerdata(Long id) {
        return userRepository.consumerdata(id);
    }

    public void payment_data(Payment payment) {
        paymentRepository.save(payment);
    }

    public List<OrderDetailsDTO> orderdetails(Long farmer_id) {
        List<Payment> payments = paymentRepository.orderdetails(farmer_id);
        List<OrderDetailsDTO> result = new ArrayList<>();

        for (Payment payment : payments) {
            Crop crop = cropRepository.findcropdata(payment.getFarmer_id(), payment.getCrop_id());
            userdata customer = userRepository.findcustomerdata(payment.getCustomer_id());
            result.add(new OrderDetailsDTO(payment, crop, customer));
        }

        return result;
    }


    public List<Object[]> orderpatch(Long customerid) {
        List<Payment> payments = paymentRepository.customer_data_payment(customerid);
        List<Object[]> paymentData = new ArrayList<>();

        for (Payment payment : payments) {
            Crop cropdata = cropRepository.findcropdata(payment.getFarmer_id(), payment.getCrop_id());
            paymentData.add(new Object[] { payment, cropdata});
        }

        return paymentData;
    }

    
}