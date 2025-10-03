package com.zoodo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderProfileResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String phone;
    private String address;
    private String userType;
    private String specializations;
    private String qualifications;
    private String licenseNumber;
    private String licenseProofPath;
    private String idProofPath;
    private String degreeProofPath;
    private String profilePhotoPath;
}


