package com.backend.farmersmarket.controller;

import com.backend.farmersmarket.entity.Instrument;
import com.backend.farmersmarket.service.InstrumentService;
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
@RequestMapping("/api")
public class InstrumentController {

    @Autowired
    private InstrumentService instrumentService;

    @PostMapping("/farmer/add-instrument")
    public ResponseEntity<?> addInstrument(
            @RequestParam("farmerId") Long farmerId,
            @RequestParam("instrumentName") String instrumentName,
            @RequestParam("description") String description,
            @RequestParam("rentPricePerDay") double rentPricePerDay,
            @RequestParam("availableFrom") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate availableFrom,
            @RequestParam("availableTo") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate availableTo,
            @RequestParam("instrumentImage") MultipartFile instrumentImage) throws IOException {
        try {
            Instrument instrument = instrumentService.addInstrument(farmerId, instrumentName, description, rentPricePerDay,
                    availableFrom, availableTo, instrumentImage);
            return ResponseEntity.ok(instrument);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/instruments")
    public ResponseEntity<List<Instrument>> getAllInstruments() {
        List<Instrument> instruments = instrumentService.getAllInstruments();
        return ResponseEntity.ok(instruments);
    }

    @GetMapping("/farmer/instruments/{farmerId}")
    public ResponseEntity<List<Instrument>> getInstrumentsByFarmer(@PathVariable Long farmerId) {
        List<Instrument> instruments = instrumentService.getInstrumentsByFarmer(farmerId);
        return ResponseEntity.ok(instruments);
    }

    @GetMapping("/instrument-image/{instrumentId}")
    public ResponseEntity<byte[]> getInstrumentImage(@PathVariable Long instrumentId) {
        Instrument instrument = instrumentService.getInstrumentById(instrumentId);
        if (instrument == null || instrument.getInstrumentImage() == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // Adjust for other image formats if needed
        return new ResponseEntity<>(instrument.getInstrumentImage(), headers, HttpStatus.OK);
    }
}