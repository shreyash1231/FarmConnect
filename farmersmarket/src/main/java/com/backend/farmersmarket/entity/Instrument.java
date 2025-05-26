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
public class Instrument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String instrumentName; // Name of the instrument
    private String description; // Description of the instrument
    private double rentPricePerDay; // Rent price per day
    private LocalDate availableFrom; // Availability start date
    private LocalDate availableTo; // Availability end date

    @Lob // Large Object annotation for storing large binary data
    @Column(columnDefinition = "LONGBLOB") // Use LONGBLOB for large images
    private byte[] instrumentImage; // Image of the instrument

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private userdata farmer; // Link to the farmer who added the instrument
}