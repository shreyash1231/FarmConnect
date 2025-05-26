package com.backend.farmersmarket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Crop {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cropName; // Matches the frontend field for crop name
    private String cropType; // Matches the frontend field for crop type
    private double minMsp; // Minimum Selling Price of the market (minMsp in frontend)
    private double maxMsp; // Maximum Selling Price of the market (maxMsp in frontend)
    private double minQty; // Minimum Quantity to Buy in quintals (minQty in frontend)
    private double farmersPrice; // Farmer's price (mapped from frontend 'Farmer's Price')

    private LocalDate harvestDate; // Harvest date field remains as is

    @Lob // Large Object annotation for storing large binary data
    @Column(columnDefinition = "LONGBLOB") // Use LONGBLOB for large images
    private byte[] cropImage; // Image uploaded by the farmer

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private userdata farmer; // Link to the farmer who added the crop
}