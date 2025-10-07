package com.zoodo.backend.repository;

import com.zoodo.backend.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, UUID> {
    
    Optional<Hospital> findByUser_Id(UUID userId);
    
    Optional<Hospital> findByUserId(UUID userId);
    
    boolean existsByFacilityLicenseNumber(String facilityLicenseNumber);
    
    boolean existsByGovtRegistrationNumber(String govtRegistrationNumber);
    
    boolean existsByTaxId(String taxId);
}
