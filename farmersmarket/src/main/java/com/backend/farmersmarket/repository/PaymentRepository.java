package com.backend.farmersmarket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.farmersmarket.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
 
    @Query(value="select * from payment where farmer_id=:farmerId",nativeQuery = true)
    List<Payment> orderdetails(@Param("farmerId")Long farmer_id);
    @Query(value="select * from payment where customer_id=:customerId",nativeQuery = true)
    List<Payment> customer_data_payment(@Param("customerId")Long customerid);
    
}
