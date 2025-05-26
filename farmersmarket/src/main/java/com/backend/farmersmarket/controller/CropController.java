package com.backend.farmersmarket.controller;

import com.backend.farmersmarket.entity.Crop;
import com.backend.farmersmarket.repository.CropRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CropController {

    @Autowired
    private CropRepository cropRepository;

    @GetMapping("/crops")
    public ResponseEntity<List<Crop>> getAllCrops() {
        List<Crop> crops = cropRepository.findAll();
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/crop-image/{cropId}")
    public ResponseEntity<byte[]> getCropImage(@PathVariable Long cropId) {
        Crop crop = cropRepository.findById(cropId).orElse(null);
        if (crop == null || crop.getCropImage() == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // Adjust for other image formats if needed
        return new ResponseEntity<>(crop.getCropImage(), headers, HttpStatus.OK);
    }
}
