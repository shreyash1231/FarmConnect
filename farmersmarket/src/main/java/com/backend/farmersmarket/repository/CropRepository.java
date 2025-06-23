package com.backend.farmersmarket.repository;

import com.backend.farmersmarket.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByFarmerId(Long farmerId); // Find crops by farmer ID
    @Query(value="select * from crop where farmer_id=:farmerId and id=:cropId", nativeQuery=true)
    Crop findcropdata(@Param("farmerId") Long farmer_id, @Param("cropId") Long crop_id);

}