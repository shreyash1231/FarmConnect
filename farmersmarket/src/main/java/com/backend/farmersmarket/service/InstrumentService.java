package com.backend.farmersmarket.service;

import com.backend.farmersmarket.entity.Instrument;
import com.backend.farmersmarket.entity.userdata;
import com.backend.farmersmarket.repository.InstrumentRepository;
import com.backend.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class InstrumentService {

    @Autowired
    private InstrumentRepository instrumentRepository;

    @Autowired
    private UserRepository userRepository;

    public Instrument addInstrument(Long farmerId, String instrumentName, String description, double rentPricePerDay,
                                   LocalDate availableFrom, LocalDate availableTo, MultipartFile instrumentImage) throws IOException {
        userdata farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer not found"));

        Instrument instrument = new Instrument();
        instrument.setInstrumentName(instrumentName);
        instrument.setDescription(description);
        instrument.setRentPricePerDay(rentPricePerDay);
        instrument.setAvailableFrom(availableFrom);
        instrument.setAvailableTo(availableTo);
        instrument.setFarmer(farmer);

        // Convert image to byte array and store in the database
        if (instrumentImage != null && !instrumentImage.isEmpty()) {
            instrument.setInstrumentImage(instrumentImage.getBytes());
        }

        return instrumentRepository.save(instrument);
    }

    public Instrument getInstrumentById(Long instrumentId) {
        return instrumentRepository.findById(instrumentId).orElse(null);
    }

    public List<Instrument> getInstrumentsByFarmer(Long farmerId) {
        return instrumentRepository.findByFarmerId(farmerId);
    }

    public List<Instrument> getAllInstruments() {
        return instrumentRepository.findAll();
    }
}