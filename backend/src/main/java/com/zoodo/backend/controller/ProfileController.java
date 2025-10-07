package com.zoodo.backend.controller;

import com.zoodo.backend.dto.ApiResponse;
import com.zoodo.backend.model.User;
import com.zoodo.backend.service.AuthService;
import com.zoodo.backend.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@Slf4j
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private AuthService authService;

    @GetMapping("/professional")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfessionalProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = authService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> profile = profileService.getProfessionalProfile(user);
            
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (Exception e) {
            log.error("Error getting professional profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get professional profile"));
        }
    }

    @PutMapping("/professional")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfessionalProfile(
            @RequestBody Map<String, Object> profileData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = authService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> updatedProfile = profileService.updateProfessionalProfile(user, profileData);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "profile", updatedProfile,
                    "message", "Professional profile updated successfully"
                )
            ));
        } catch (Exception e) {
            log.error("Error updating professional profile: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to update professional profile: " + e.getMessage()));
        }
    }

    @PostMapping("/upload-document")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = authService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            String fileUrl = profileService.uploadDocument(user, file, documentType);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "fileUrl", fileUrl,
                    "documentType", documentType,
                    "message", "Document uploaded successfully"
                )
            ));
        } catch (Exception e) {
            log.error("Error uploading document: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to upload document: " + e.getMessage()));
        }
    }

    @DeleteMapping("/document/{documentType}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteDocument(
            @PathVariable String documentType) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = authService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            profileService.deleteDocument(user, documentType);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "documentType", documentType,
                    "message", "Document deleted successfully"
                )
            ));
        } catch (Exception e) {
            log.error("Error deleting document: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to delete document: " + e.getMessage()));
        }
    }

    @GetMapping("/verification-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getVerificationStatus() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = authService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> status = profileService.getVerificationStatus(user);
            
            return ResponseEntity.ok(ApiResponse.success(status));
        } catch (Exception e) {
            log.error("Error getting verification status: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get verification status"));
        }
    }

    @PostMapping("/request-verification")
    public ResponseEntity<ApiResponse<Map<String, Object>>> requestVerification() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = authService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            profileService.requestVerification(user);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of("message", "Verification request submitted successfully")
            ));
        } catch (Exception e) {
            log.error("Error requesting verification: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to request verification: " + e.getMessage()));
        }
    }
}
