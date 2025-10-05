package com.zoodo.backend.repository;

import com.zoodo.backend.model.PetOwnerRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PetOwnerRegistrationRepository extends JpaRepository<PetOwnerRegistration, UUID> {
    
    // Find by email
    Optional<PetOwnerRegistration> findByEmail(String email);
    
    // Find by username
    Optional<PetOwnerRegistration> findByUsername(String username);
    
    // Find by registration status
    List<PetOwnerRegistration> findByRegistrationStatus(PetOwnerRegistration.RegistrationStatus status);
    
    // Find active registrations
    List<PetOwnerRegistration> findByIsActiveTrue();
    
    // Find by email and status
    Optional<PetOwnerRegistration> findByEmailAndRegistrationStatus(String email, PetOwnerRegistration.RegistrationStatus status);
    
    // Find by username and status
    Optional<PetOwnerRegistration> findByUsernameAndRegistrationStatus(String username, PetOwnerRegistration.RegistrationStatus status);
    
    // Check if email exists (excluding specific ID)
    @Query("SELECT COUNT(p) > 0 FROM PetOwnerRegistration p WHERE p.email = :email AND p.id != :id")
    boolean existsByEmailExcludingId(@Param("email") String email, @Param("id") UUID id);
    
    // Check if username exists (excluding specific ID)
    @Query("SELECT COUNT(p) > 0 FROM PetOwnerRegistration p WHERE p.username = :username AND p.id != :id")
    boolean existsByUsernameExcludingId(@Param("username") String username, @Param("id") UUID id);
    
    // Find registrations created after a specific date
    @Query("SELECT p FROM PetOwnerRegistration p WHERE p.createdAt >= :date ORDER BY p.createdAt DESC")
    List<PetOwnerRegistration> findRegistrationsAfterDate(@Param("date") java.time.LocalDateTime date);
    
    // Find registrations by city
    List<PetOwnerRegistration> findByCityIgnoreCase(String city);
    
    // Find registrations by country
    List<PetOwnerRegistration> findByCountryIgnoreCase(String country);
}
