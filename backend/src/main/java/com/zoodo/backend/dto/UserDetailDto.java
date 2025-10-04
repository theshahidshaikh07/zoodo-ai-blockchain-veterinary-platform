package com.zoodo.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Data
public class UserDetailDto {
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
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    
    // Veterinarian specific fields
    private String licenseNumber;
    private Integer experience;
    private String[] specializations;
    private String[] qualifications;
    private String resumeUrl;
    private String profilePhotoUrl;
    private String licenseProofUrl;
    private String idProofUrl;
    private String degreeProofUrl;
    private Boolean isAffiliated;
    private String affiliatedFacilityName;
    private String affiliatedType;
    private String otherFacilityName;
    private Boolean offerOnlineConsultation;
    private Boolean offerHomeVisits;
    private String homeServiceAddress;
    private Boolean homeServiceSameAsPersonal;
    private String homeServiceStreet;
    private String homeServiceCity;
    private String homeServiceZip;
    private Integer homeVisitRadius;
    private String availabilitySettings;
    
    // Trainer specific fields
    private String[] certifications;
    private String practiceType;
    private Boolean offerOnlineTraining;
    private Boolean offerHomeTraining;
    private Boolean offerGroupClasses;
    private String independentServiceAddress;
    private Boolean independentServiceSameAsPersonal;
    private String independentServiceStreet;
    private String independentServiceCity;
    private String independentServiceZip;
    private Integer homeTrainingRadius;
    private Boolean hasTrainingCenter;
    private String trainingCenterName;
    private String trainingCenterAddress;
    private Boolean hasAcademy;
    private String academyName;
    private String academyStreet;
    private String academyCity;
    private String academyState;
    private String academyPostalCode;
    private String academyCountry;
    private String academyPhone;
    
    // Pet owner specific fields
    private List<PetSummaryDto> pets;
    
    // System fields
    private Integer profileCompletion;
    private String notes; // Admin notes
    private LocalDateTime verifiedAt;
    private String verifiedBy;
    
    @Data
    public static class PetSummaryDto {
        private UUID id;
        private String name;
        private String species;
        private String breed;
        private String gender;
        private LocalDateTime birthDate;
        private Integer age;
        private String ageUnit;
        private Double weight;
        private String weightUnit;
        private String microchipId;
        private Boolean sterilized;
        private String photoUrl;
        private LocalDateTime createdAt;
    }
}
