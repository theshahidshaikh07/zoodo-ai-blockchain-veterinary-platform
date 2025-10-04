package com.zoodo.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class PetOwnerRegistrationRequest {
    
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
    
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;
    
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
    
    @Valid
    private List<PetInfoDto> pets;
    
    @Data
    public static class PetInfoDto {
        
        @NotBlank(message = "Pet name is required")
        @Size(max = 100, message = "Pet name must not exceed 100 characters")
        private String name;
        
        @NotBlank(message = "Species is required")
        @Size(max = 50, message = "Species must not exceed 50 characters")
        private String species;
        
        @Size(max = 100, message = "Breed must not exceed 100 characters")
        private String breed;
        
        @Pattern(regexp = "^(male|female|unknown)$", message = "Gender must be male, female, or unknown")
        private String gender;
        
        private String birthday;
        
        @Min(value = 0, message = "Age must be non-negative")
        private Integer age;
        
        @Pattern(regexp = "^(Years|Months|Days)$", message = "Age unit must be Years, Months, or Days")
        private String ageUnit;
        
        @DecimalMin(value = "0.0", message = "Weight must be non-negative")
        private java.math.BigDecimal weight;
        
        @Pattern(regexp = "^(Kgs|Gms)$", message = "Weight unit must be Kgs or Gms")
        private String weightUnit;
        
        @Size(max = 50, message = "Microchip ID must not exceed 50 characters")
        private String microchip;
        
        @Pattern(regexp = "^(yes|no)$", message = "Sterilized must be yes or no")
        private String sterilized;
        
        @Size(max = 500, message = "Photo URL must not exceed 500 characters")
        private String photoUrl;
    }
}



