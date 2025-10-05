package com.zoodo.backend.repository;

import com.zoodo.backend.model.TrainerRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrainerRegistrationRepository extends JpaRepository<TrainerRegistration, UUID> {
    
    // Find by email
    Optional<TrainerRegistration> findByEmail(String email);
    
    // Find by username
    Optional<TrainerRegistration> findByUsername(String username);
    
    // Find by registration status
    List<TrainerRegistration> findByRegistrationStatus(TrainerRegistration.RegistrationStatus status);
    
    // Find active registrations
    List<TrainerRegistration> findByIsActiveTrue();
    
    // Find by email and status
    Optional<TrainerRegistration> findByEmailAndRegistrationStatus(String email, TrainerRegistration.RegistrationStatus status);
    
    // Find by username and status
    Optional<TrainerRegistration> findByUsernameAndRegistrationStatus(String username, TrainerRegistration.RegistrationStatus status);
    
    // Check if email exists (excluding specific ID)
    @Query("SELECT COUNT(t) > 0 FROM TrainerRegistration t WHERE t.email = :email AND t.id != :id")
    boolean existsByEmailExcludingId(@Param("email") String email, @Param("id") UUID id);
    
    // Check if username exists (excluding specific ID)
    @Query("SELECT COUNT(t) > 0 FROM TrainerRegistration t WHERE t.username = :username AND t.id != :id")
    boolean existsByUsernameExcludingId(@Param("username") String username, @Param("id") UUID id);
    
    // Find registrations created after a specific date
    @Query("SELECT t FROM TrainerRegistration t WHERE t.createdAt >= :date ORDER BY t.createdAt DESC")
    List<TrainerRegistration> findRegistrationsAfterDate(@Param("date") java.time.LocalDateTime date);
    
    // Find by experience range
    @Query("SELECT t FROM TrainerRegistration t WHERE t.experience >= :minExperience AND t.experience <= :maxExperience")
    List<TrainerRegistration> findByExperienceRange(@Param("minExperience") Integer minExperience, @Param("maxExperience") Integer maxExperience);
    
    // Find by specialization
    @Query("SELECT t FROM TrainerRegistration t WHERE :specialization MEMBER OF t.specializations")
    List<TrainerRegistration> findBySpecialization(@Param("specialization") String specialization);
    
    // Find by certification
    @Query("SELECT t FROM TrainerRegistration t WHERE :certification MEMBER OF t.certifications")
    List<TrainerRegistration> findByCertification(@Param("certification") String certification);
    
    // Find trainers offering online training
    List<TrainerRegistration> findByOfferOnlineTrainingTrue();
    
    // Find trainers with academy
    List<TrainerRegistration> findByHasAcademyTrue();
    
    // Find by academy name
    List<TrainerRegistration> findByAcademyNameIgnoreCase(String academyName);
    
    // Find by academy city
    List<TrainerRegistration> findByAcademyCityIgnoreCase(String academyCity);
    
    // Find by academy state
    List<TrainerRegistration> findByAcademyStateIgnoreCase(String academyState);
    
    // Find by academy country
    List<TrainerRegistration> findByAcademyCountryIgnoreCase(String academyCountry);
}
