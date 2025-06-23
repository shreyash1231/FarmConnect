package com.backend.farmersmarket.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.farmersmarket.entity.OrderDetailsDTO;
import com.backend.farmersmarket.entity.Payment;
import com.backend.farmersmarket.service.UserService;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    
    @Autowired
    private UserService userService;

    @PostMapping("/paymentdetails")
    public void payment_data(@RequestBody Payment payment )
    {
        userService.payment_data(payment);
    }

    @GetMapping("/orderReceive/{farmer_id}")
    public List<OrderDetailsDTO> orderdetails(@PathVariable("farmer_id") Long farmer_id) {
        return userService.orderdetails(farmer_id);
    }

    @GetMapping("/orderpatch/{customer_id}")
    public List<Object[]> orderpatch(@PathVariable("customer_id")Long customerid)
    {
        return userService.orderpatch(customerid);
    }
    
}
