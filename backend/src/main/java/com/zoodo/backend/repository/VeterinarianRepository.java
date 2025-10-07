package com.zoodo.backend.repository;

import com.zoodo.backend.model.User;
import com.zoodo.backend.model.Veterinarian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VeterinarianRepository extends JpaRepository<Veterinarian, UUID> {
    
    Optional<Veterinarian> findByUser(User user);
    
    Optional<Veterinarian> findByUserId(UUID userId);
    
    Optional<Veterinarian> findByLicenseNumber(String licenseNumber);
    
    boolean existsByLicenseNumber(String licenseNumber);
    
    @Query("SELECT v FROM Veterinarian v WHERE v.user.isActive = true AND v.offerOnlineConsultation = true")
    List<Veterinarian> findOnlineConsultationProviders();
    
    @Query("SELECT v FROM Veterinarian v WHERE v.user.isActive = true AND v.offerHomeConsultation = true")
    List<Veterinarian> findHomeVisitProviders();
    
    @Query("SELECT v FROM Veterinarian v JOIN v.user u WHERE " +
           "u.city = :city AND u.state = :state AND u.isActive = true")
    List<Veterinarian> findByLocation(@Param("city") String city, @Param("state") String state);
    
    @Query("SELECT v FROM Veterinarian v WHERE v.user.isActive = true AND EXISTS (SELECT 1 FROM v.specializations s WHERE s IN :specializations)")
    List<Veterinarian> findBySpecializations(@Param("specializations") List<String> specializations);
    
    @Query("SELECT v FROM Veterinarian v WHERE v.user.isVerified = true AND v.user.isActive = true")
    List<Veterinarian> findVerifiedAndActiveVeterinarians();
}



