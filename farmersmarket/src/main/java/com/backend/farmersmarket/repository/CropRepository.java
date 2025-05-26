package com.backend.farmersmarket.repository;

import com.backend.farmersmarket.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByFarmerId(Long farmerId); // Find crops by farmer ID
}