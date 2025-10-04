package com.zoodo.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserSummaryDto {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String userType;
    private String status;
    private Boolean isVerified;
    private Boolean isActive;
    private String city;
    private String state;
    private String country;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    
    // Additional fields for specific user types
    private String licenseNumber; // For veterinarians
    private Integer experience; // For veterinarians and trainers
    private String[] specializations; // For veterinarians and trainers
    private String[] qualifications; // For veterinarians
    private String[] certifications; // For trainers
    private Integer petCount; // For pet owners
    
    // Profile completion percentage
    private Integer profileCompletion;
}
