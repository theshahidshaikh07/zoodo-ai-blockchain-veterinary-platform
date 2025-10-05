package com.zoodo.backend.repository;

import com.zoodo.backend.model.VeterinarianRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VeterinarianRegistrationRepository extends JpaRepository<VeterinarianRegistration, UUID> {
    
    // Find by email
    Optional<VeterinarianRegistration> findByEmail(String email);
    
    // Find by username
    Optional<VeterinarianRegistration> findByUsername(String username);
    
    // Find by license number
    Optional<VeterinarianRegistration> findByLicenseNumber(String licenseNumber);
    
    // Find by registration status
    List<VeterinarianRegistration> findByRegistrationStatus(VeterinarianRegistration.RegistrationStatus status);
    
    // Find active registrations
    List<VeterinarianRegistration> findByIsActiveTrue();
    
    // Find by email and status
    Optional<VeterinarianRegistration> findByEmailAndRegistrationStatus(String email, VeterinarianRegistration.RegistrationStatus status);
    
    // Find by username and status
    Optional<VeterinarianRegistration> findByUsernameAndRegistrationStatus(String username, VeterinarianRegistration.RegistrationStatus status);
    
    // Find by license number and status
    Optional<VeterinarianRegistration> findByLicenseNumberAndRegistrationStatus(String licenseNumber, VeterinarianRegistration.RegistrationStatus status);
    
    // Check if email exists (excluding specific ID)
    @Query("SELECT COUNT(v) > 0 FROM VeterinarianRegistration v WHERE v.email = :email AND v.id != :id")
    boolean existsByEmailExcludingId(@Param("email") String email, @Param("id") UUID id);
    
    // Check if username exists (excluding specific ID)
    @Query("SELECT COUNT(v) > 0 FROM VeterinarianRegistration v WHERE v.username = :username AND v.id != :id")
    boolean existsByUsernameExcludingId(@Param("username") String username, @Param("id") UUID id);
    
    // Check if license number exists (excluding specific ID)
    @Query("SELECT COUNT(v) > 0 FROM VeterinarianRegistration v WHERE v.licenseNumber = :licenseNumber AND v.id != :id")
    boolean existsByLicenseNumberExcludingId(@Param("licenseNumber") String licenseNumber, @Param("id") UUID id);
    
    // Find registrations created after a specific date
    @Query("SELECT v FROM VeterinarianRegistration v WHERE v.createdAt >= :date ORDER BY v.createdAt DESC")
    List<VeterinarianRegistration> findRegistrationsAfterDate(@Param("date") java.time.LocalDateTime date);
    
    // Find by experience range
    @Query("SELECT v FROM VeterinarianRegistration v WHERE v.experience >= :minExperience AND v.experience <= :maxExperience")
    List<VeterinarianRegistration> findByExperienceRange(@Param("minExperience") Integer minExperience, @Param("maxExperience") Integer maxExperience);
    
    // Find by specialization
    @Query("SELECT v FROM VeterinarianRegistration v WHERE :specialization MEMBER OF v.specializations")
    List<VeterinarianRegistration> findBySpecialization(@Param("specialization") String specialization);
    
    // Find by qualification
    @Query("SELECT v FROM VeterinarianRegistration v WHERE :qualification MEMBER OF v.qualifications")
    List<VeterinarianRegistration> findByQualification(@Param("qualification") String qualification);
    
    // Find veterinarians offering online consultation
    List<VeterinarianRegistration> findByOfferOnlineConsultationTrue();
    
    // Find veterinarians offering home consultation
    List<VeterinarianRegistration> findByOfferHomeConsultationTrue();
    
    // Find affiliated veterinarians
    List<VeterinarianRegistration> findByIsAffiliatedTrue();
    
    // Find by affiliated facility name
    List<VeterinarianRegistration> findByAffiliatedFacilityNameIgnoreCase(String facilityName);
}
