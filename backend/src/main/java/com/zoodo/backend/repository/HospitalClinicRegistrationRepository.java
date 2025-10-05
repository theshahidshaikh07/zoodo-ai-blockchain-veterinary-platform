package com.zoodo.backend.repository;

import com.zoodo.backend.model.HospitalClinicRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HospitalClinicRegistrationRepository extends JpaRepository<HospitalClinicRegistration, UUID> {
    
    // Find by email
    Optional<HospitalClinicRegistration> findByEmail(String email);
    
    // Find by username
    Optional<HospitalClinicRegistration> findByUsername(String username);
    
    // Find by facility license number
    Optional<HospitalClinicRegistration> findByFacilityLicenseNumber(String facilityLicenseNumber);
    
    // Find by government registration number
    Optional<HospitalClinicRegistration> findByGovtRegistrationNumber(String govtRegistrationNumber);
    
    // Find by tax ID
    Optional<HospitalClinicRegistration> findByTaxId(String taxId);
    
    // Find by account type
    List<HospitalClinicRegistration> findByAccountType(HospitalClinicRegistration.AccountType accountType);
    
    // Find by registration status
    List<HospitalClinicRegistration> findByRegistrationStatus(HospitalClinicRegistration.RegistrationStatus status);
    
    // Find active registrations
    List<HospitalClinicRegistration> findByIsActiveTrue();
    
    // Find by email and status
    Optional<HospitalClinicRegistration> findByEmailAndRegistrationStatus(String email, HospitalClinicRegistration.RegistrationStatus status);
    
    // Find by username and status
    Optional<HospitalClinicRegistration> findByUsernameAndRegistrationStatus(String username, HospitalClinicRegistration.RegistrationStatus status);
    
    // Find by license number and status
    Optional<HospitalClinicRegistration> findByFacilityLicenseNumberAndRegistrationStatus(String facilityLicenseNumber, HospitalClinicRegistration.RegistrationStatus status);
    
    // Check if email exists (excluding specific ID)
    @Query("SELECT COUNT(h) > 0 FROM HospitalClinicRegistration h WHERE h.email = :email AND h.id != :id")
    boolean existsByEmailExcludingId(@Param("email") String email, @Param("id") UUID id);
    
    // Check if username exists (excluding specific ID)
    @Query("SELECT COUNT(h) > 0 FROM HospitalClinicRegistration h WHERE h.username = :username AND h.id != :id")
    boolean existsByUsernameExcludingId(@Param("username") String username, @Param("id") UUID id);
    
    // Check if facility license number exists (excluding specific ID)
    @Query("SELECT COUNT(h) > 0 FROM HospitalClinicRegistration h WHERE h.facilityLicenseNumber = :facilityLicenseNumber AND h.id != :id")
    boolean existsByFacilityLicenseNumberExcludingId(@Param("facilityLicenseNumber") String facilityLicenseNumber, @Param("id") UUID id);
    
    // Check if government registration number exists (excluding specific ID)
    @Query("SELECT COUNT(h) > 0 FROM HospitalClinicRegistration h WHERE h.govtRegistrationNumber = :govtRegistrationNumber AND h.id != :id")
    boolean existsByGovtRegistrationNumberExcludingId(@Param("govtRegistrationNumber") String govtRegistrationNumber, @Param("id") UUID id);
    
    // Check if tax ID exists (excluding specific ID)
    @Query("SELECT COUNT(h) > 0 FROM HospitalClinicRegistration h WHERE h.taxId = :taxId AND h.id != :id")
    boolean existsByTaxIdExcludingId(@Param("taxId") String taxId, @Param("id") UUID id);
    
    // Find registrations created after a specific date
    @Query("SELECT h FROM HospitalClinicRegistration h WHERE h.createdAt >= :date ORDER BY h.createdAt DESC")
    List<HospitalClinicRegistration> findRegistrationsAfterDate(@Param("date") java.time.LocalDateTime date);
    
    // Find by business name
    List<HospitalClinicRegistration> findByBusinessNameIgnoreCase(String businessName);
    
    // Find by city
    List<HospitalClinicRegistration> findByCityIgnoreCase(String city);
    
    // Find by state
    List<HospitalClinicRegistration> findByStateIgnoreCase(String state);
    
    // Find by country
    List<HospitalClinicRegistration> findByCountryIgnoreCase(String country);
    
    // Find by contact person
    List<HospitalClinicRegistration> findByContactPersonIgnoreCase(String contactPerson);
    
    // Find by medical director name
    List<HospitalClinicRegistration> findByMedicalDirectorNameIgnoreCase(String medicalDirectorName);
    
    // Find by medical director license number
    Optional<HospitalClinicRegistration> findByMedicalDirectorLicenseNumber(String medicalDirectorLicenseNumber);
    
    // Find facilities offering online consultation
    List<HospitalClinicRegistration> findByOfferOnlineConsultationTrue();
    
    // Find facilities offering clinic/hospital services
    List<HospitalClinicRegistration> findByOfferClinicHospitalTrue();
    
    // Find by account type and status
    List<HospitalClinicRegistration> findByAccountTypeAndRegistrationStatus(HospitalClinicRegistration.AccountType accountType, HospitalClinicRegistration.RegistrationStatus status);
}
