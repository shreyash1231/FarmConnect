package com.backend.farmersmarket.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class userdata{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Email
    @Column(nullable = false, unique = true)
    private String email;
    private String name;
    @Column(nullable=false,unique=true)
    private String username;
    private String gender;
    @Column(nullable=false)
    private String password;
    @Column(nullable = false, unique = true,length=10)    
    private String mobileNumber;
    private String city;
    private String state;
    private String userType; // "farmer" or "customer"
    private Double landOwnedAcres; // Only for farmers
    @Column(unique = true) 
    private String UpiId;
}
