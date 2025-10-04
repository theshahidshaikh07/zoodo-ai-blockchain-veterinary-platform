package com.zoodo.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data
public class VeterinarianRegistrationRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    private String username;
    
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    
    @NotBlank(message = "Phone number is required")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;
    
    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @NotBlank(message = "License number is required")
    @Size(max = 100, message = "License number must not exceed 100 characters")
    private String licenseNumber;
    
    @Min(value = 0, message = "Experience must be non-negative")
    private Integer experience;
    
    @NotEmpty(message = "At least one specialization is required")
    private List<String> specialization;
    
    @NotEmpty(message = "At least one qualification is required")
    private List<String> qualifications;
    
    // Document files - will be handled separately
    private MultipartFile licenseProof;
    private MultipartFile idProof;
    private MultipartFile degreeProof;
    private MultipartFile profilePhoto;
    
    // Affiliation details
    private Boolean isAffiliated = false;
    private String affiliatedFacilityName;
    private String affiliatedType;
    private String otherFacilityName;
    
    // Service offerings
    private Boolean offerOnlineConsultation = false;
    private Boolean offerHomeVisits = false;
    
    // Service address details (if different from personal)
    private Boolean homeServiceSameAsPersonal = true;
    private String homeServiceStreet;
    private String homeServiceCity;
    private String homeServiceZip;
    
    @Min(value = 1, message = "Home visit radius must be at least 1 km")
    private Integer homeVisitRadius;
    
    // Additional fields that might come from frontend forms as JSON
    private String independentServices; // JSON string
    private String availabilitySchedule; // JSON string
    
    // Custom specialization/qualification fields
    private String otherSpecialization;
    private String otherQualification;
    
    // Getters for custom fields
    public String getOtherSpecialization() { return otherSpecialization; }
    public void setOtherSpecialization(String otherSpecialization) { this.otherSpecialization = otherSpecialization; }
    
    public String getOtherQualification() { return otherQualification; }
    public void setOtherQualification(String otherQualification) { this.otherQualification = otherQualification; }
    
    // Helper methods for processing
    public List<String> getSpecializationList() {
        return specialization != null ? specialization : List.of();
    }
    
    public List<String> getQualificationList() {
        return qualifications != null ? qualifications : List.of();
    }
    
    public boolean hasCustomSpecialization() {
        return specialization != null && specialization.contains("Other");
    }
    
    public boolean hasCustomQualification() {
        return qualifications != null && qualifications.contains("Other");
    }
}
