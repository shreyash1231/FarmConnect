package com.backend.farmersmarket.service;

import com.backend.farmersmarket.entity.Crop;
import com.backend.farmersmarket.entity.userdata;
import com.backend.farmersmarket.repository.CropRepository;
import com.backend.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class FarmerService {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private UserRepository userRepository;
    public Crop addCrop(Long farmerId, String cropName, String cropType, double minMsp, double maxMsp, 
    double minQty, double farmersPrice, LocalDate harvestDate, MultipartFile cropImage) throws IOException {
            // Fetch the farmer by ID
        userdata farmer = userRepository.findById(farmerId)
        .orElseThrow(() -> new IllegalArgumentException("Farmer not found"));

        // Create a new Crop object
        Crop crop = new Crop();
        crop.setCropName(cropName);        // Set the name of the crop
        crop.setCropType(cropType);        // Set the type of the crop
        crop.setMinMsp(minMsp);            // Set the Minimum Selling Price of the market
        crop.setMaxMsp(maxMsp);            // Set the Maximum Selling Price of the market
        crop.setMinQty(minQty);            // Set the Minimum Quantity to Buy in quintals
        crop.setFarmersPrice(farmersPrice); // Set the Farmer's Price
        crop.setHarvestDate(harvestDate);  // Set the harvest date
        crop.setFarmer(farmer);            // Link the crop to the farmer

        // Convert the crop image to a byte array and store it in the database
        if (cropImage != null && !cropImage.isEmpty()) {
        crop.setCropImage(cropImage.getBytes());
        }

        // Save the Crop object to the repository and return it
        return cropRepository.save(crop);
    }


    public Crop getCropById(Long cropId) {
        return cropRepository.findById(cropId).orElse(null);
    }

    public List<Crop> getCropsByFarmer(Long farmerId) {
        return cropRepository.findByFarmerId(farmerId);
    }
}
