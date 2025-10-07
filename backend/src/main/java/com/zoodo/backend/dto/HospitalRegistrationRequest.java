package com.zoodo.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class HospitalRegistrationRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    private String username;
    
    @NotBlank(message = "Business name is required")
    @Size(max = 255, message = "Business name must not exceed 255 characters")
    private String businessName;
    
    @NotBlank(message = "Contact person is required")
    @Size(max = 100, message = "Contact person must not exceed 100 characters")
    private String contactPerson;
    
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
    
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;
    
    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;
    
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;
    
    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;
    
    @NotBlank(message = "Account type is required")
    @Pattern(regexp = "^(hospital|clinic)$", message = "Account type must be hospital or clinic")
    private String accountType;
    
    // Business services
    private Boolean offerOnlineConsultation = false;
    private Boolean offerClinicHospital = true;
    
    // Compliance details
    @NotBlank(message = "Facility license number is required")
    @Size(max = 100, message = "Facility license number must not exceed 100 characters")
    private String facilityLicenseNumber;
    
    @NotBlank(message = "Government registration number is required")
    @Size(max = 100, message = "Government registration number must not exceed 100 characters")
    private String govtRegistrationNumber;
    
    @NotBlank(message = "Tax ID is required")
    @Size(max = 100, message = "Tax ID must not exceed 100 characters")
    private String taxId;
    
    @NotBlank(message = "Medical director name is required")
    @Size(max = 100, message = "Medical director name must not exceed 100 characters")
    private String medicalDirectorName;
    
    @NotBlank(message = "Medical director license number is required")
    @Size(max = 100, message = "Medical director license number must not exceed 100 characters")
    private String medicalDirectorLicenseNumber;
    
    // Document files
    private MultipartFile facilityLicenseDocument;
    
    // Helper methods
    public String getFirstName() {
        return businessName; // For compatibility with User model
    }
    
    public String getLastName() {
        return accountType.equals("hospital") ? "Hospital" : "Clinic";
    }
    
    public String getFullAddress() {
        return String.format("%s, %s %s, %s, %s", address, city, postalCode, state, country);
    }
}
