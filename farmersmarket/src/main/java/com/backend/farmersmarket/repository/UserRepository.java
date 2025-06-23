package com.backend.farmersmarket.repository;

import com.backend.farmersmarket.entity.userdata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<userdata, Long> {
    Optional<userdata> findByUsername(String username);
    Optional<userdata> findByEmail(String email);
    
    @Query(value="select * from userdata where id=:Id and user_type='customer'",nativeQuery=true)
    userdata consumerdata(@Param("Id")Long id);
    @Query(value="select * from userdata where id=:customerId",nativeQuery = true)
    userdata findcustomerdata(@Param("customerId")Long customer_id);
}