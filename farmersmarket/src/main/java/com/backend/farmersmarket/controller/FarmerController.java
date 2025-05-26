package com.backend.farmersmarket.controller;

import com.backend.farmersmarket.entity.Crop;
import com.backend.farmersmarket.service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @PostMapping("/add-crop")
public ResponseEntity<?> addCrop(
        @RequestParam("farmerId") Long farmerId,
        @RequestParam("cropName") String cropName,
        @RequestParam("cropType") String cropType,
        @RequestParam("minMsp") double minMsp,
        @RequestParam("maxMsp") double maxMsp,
        @RequestParam("minQty") double minQty,
        @RequestParam("farmersPrice") double farmersPrice,
        @RequestParam("harvestDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate harvestDate,
        @RequestParam("cropImage") MultipartFile cropImage) throws IOException {
    try {
        Crop crop = farmerService.addCrop(
                farmerId,
                cropName,
                cropType,
                minMsp,
                maxMsp,
                minQty,
                farmersPrice,
                harvestDate,
                cropImage
        );
        return ResponseEntity.ok(crop);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
    }
}

    @GetMapping("/crops/{farmerId}")
    public ResponseEntity<List<Crop>> getCropsByFarmer(@PathVariable Long farmerId) {
        List<Crop> crops = farmerService.getCropsByFarmer(farmerId);
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/crop-image/{cropId}")
    public ResponseEntity<byte[]> getCropImage(@PathVariable Long cropId) {
        Crop crop = farmerService.getCropById(cropId);
        if (crop == null || crop.getCropImage() == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // Adjust for other image formats if needed
        return new ResponseEntity<>(crop.getCropImage(), headers, HttpStatus.OK);
    }
}
