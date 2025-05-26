package com.backend.farmersmarket.repository;

import com.backend.farmersmarket.entity.Instrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, Long> {
    List<Instrument> findByFarmerId(Long farmerId); // Find instruments by farmer ID
}