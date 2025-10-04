package com.zoodo.backend.controller;

import com.zoodo.backend.dto.*;
import com.zoodo.backend.model.User;
import com.zoodo.backend.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/register")
@Slf4j
@CrossOrigin(origins = "*")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/pet-owner")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerPetOwner(
            @Valid @RequestBody PetOwnerRegistrationRequest request) {
        try {
            log.info("Processing pet owner registration for username: {}", request.getUsername());
            
            User user = registrationService.registerPetOwner(request);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "userId", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "userType", user.getUserType().getValue(),
                    "message", "Pet owner registered successfully"
                )
            ));
        } catch (Exception e) {
            log.error("Error registering pet owner: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/veterinarian", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerVeterinarian(
            @RequestPart("registrationData") String registrationDataJson,
            @RequestPart(value = "licenseProof", required = false) MultipartFile licenseProof,
            @RequestPart(value = "idProof", required = false) MultipartFile idProof,
            @RequestPart(value = "degreeProof", required = false) MultipartFile degreeProof,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto) {
        try {
            log.info("Processing veterinarian registration");
            
            User user = registrationService.registerVeterinarian(registrationDataJson, 
                licenseProof, idProof, degreeProof, profilePhoto);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "userId", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "userType", user.getUserType().getValue(),
                    "message", "Veterinarian registered successfully. Your account will be verified after document review."
                )
            ));
        } catch (Exception e) {
            log.error("Error registering veterinarian: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/trainer", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerTrainer(
            @RequestPart("registrationData") String registrationDataJson,
            @RequestPart(value = "resume", required = false) MultipartFile resume,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto) {
        try {
            log.info("Processing trainer registration");
            
            User user = registrationService.registerTrainer(registrationDataJson, resume, profilePhoto);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "userId", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "userType", user.getUserType().getValue(),
                    "message", "Trainer registered successfully. Your account will be verified after document review."
                )
            ));
        } catch (Exception e) {
            log.error("Error registering trainer: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/hospital", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerHospital(
            @RequestPart("registrationData") String registrationDataJson,
            @RequestPart(value = "facilityLicenseDocument", required = false) MultipartFile facilityLicenseDocument) {
        try {
            log.info("Processing hospital/clinic registration");
            
            User user = registrationService.registerHospital(registrationDataJson, facilityLicenseDocument);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "userId", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "userType", user.getUserType().getValue(),
                    "message", "Hospital/Clinic registered successfully. Your account will be verified after document review."
                )
            ));
        } catch (Exception e) {
            log.error("Error registering hospital/clinic: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/username-check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkUsernameAvailability(
            @RequestParam String username) {
        try {
            boolean available = registrationService.isUsernameAvailable(username);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "username", username,
                    "available", available,
                    "message", available ? "Username is available" : "Username is already taken"
                )
            ));
        } catch (Exception e) {
            log.error("Error checking username availability: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Unable to check username availability: " + e.getMessage()));
        }
    }

    @PostMapping("/email-check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkEmailAvailability(
            @RequestParam String email) {
        try {
            boolean available = registrationService.isEmailAvailable(email);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "email", email,
                    "available", available,
                    "message", available ? "Email is available" : "Email is already registered"
                )
            ));
        } catch (Exception e) {
            log.error("Error checking email availability: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Unable to check email availability: " + e.getMessage()));
        }
    }

    @GetMapping("/license-check/{licenseNumber}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkLicenseAvailability(
            @PathVariable String licenseNumber) {
        try {
            boolean available = registrationService.isLicenseAvailable(licenseNumber);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "licenseNumber", licenseNumber,
                    "available", available,
                    "message", available ? "License number is available" : "License number is already registered"
                )
            ));
        } catch (Exception e) {
            log.error("Error checking license availability: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Unable to check license availability: " + e.getMessage()));
        }
    }
}
