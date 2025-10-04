package com.zoodo.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class TrainerRegistrationRequest {
    
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
    
    @Min(value = 0, message = "Experience must be non-negative")
    private Integer experience;
    
    @NotEmpty(message = "At least one specialization is required")
    private List<String> specialization;
    
    @NotEmpty(message = "At least one certification is required")
    private List<String> certifications;
    
    // Document files - will be handled separately
    private MultipartFile resume;
    private MultipartFile profilePhoto;
    
    // Practice type details
    private String practiceType; // JSON string
    
    private String otherSpecialization;
    private String otherCertification;
    
    // Service offerings
    private Boolean offerOnlineTraining = false;
    private Boolean offerHomeTraining = false;
    private Boolean offerGroupClasses = false;
    
    // Independent practice details
    private Boolean independentServiceSameAsPersonal = true;
    private String independentServiceStreet;
    private String independentServiceCity;
    private String independentServiceZip;
    
    @Min(value = 1, message = "Home training radius must be at least 1 km")
    private Integer homeTrainingRadius;
    
    // Training center details
    private Boolean hasTrainingCenter = false;
    private String trainingCenterName;
    private String trainingCenterAddress;
    
    // Academy details
    private Boolean hasAcademy = false;
    private String academyName;
    private String academyStreet;
    private String academyCity;
    private String academyState;
    private String academyPostalCode;
    private String academyCountry;
    private String academyPhone;
    
    // Additional fields that might come from frontend forms as JSON
    private String independentServices; // JSON string
    private String availabilitySchedule; // JSON string
    
    // Getters for custom fields
    public String getOtherSpecialization() { return otherSpecialization; }
    public void setOtherSpecialization(String otherSpecialization) { this.otherSpecialization = otherSpecialization; }
    
    public String getOtherCertification() { return otherCertification; }
    public void setOtherCertification(String otherCertification) { this.otherCertification = otherCertification; }
    
    // Helper methods for processing
    public List<String> getSpecializationList() {
        return specialization != null ? specialization : List.of();
    }
    
    public List<String> getCertificationList() {
        return certifications != null ? certifications : List.of();
    }
    
    public boolean hasCustomSpecialization() {
        return specialization != null && specialization.contains("Other");
    }
    
    public boolean hasCustomCertification() {
        return certifications != null && certifications.contains("Other");
    }
}
