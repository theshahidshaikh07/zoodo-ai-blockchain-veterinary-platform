package com.zoodo.backend.controller;

import com.zoodo.backend.dto.*;
import com.zoodo.backend.model.User;
import com.zoodo.backend.service.AuthService;
import com.zoodo.backend.util.JwtUtil;
import com.zoodo.backend.exception.ErrorCodes;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody UserLoginRequest request) {
        try {
            log.info("Login attempt for username: {}", request.getUsername());
            
            // Authenticate user
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            // Get user details
            User user = authService.getUserByUsernameOrEmail(request.getUsername());
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(
                        ErrorCodes.INVALID_CREDENTIALS.getMessage(),
                        ErrorCodes.INVALID_CREDENTIALS.getCode(),
                        ErrorCodes.INVALID_CREDENTIALS.getType()
                    ));
            }
            
            if (!user.getIsActive()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(
                        ErrorCodes.ACCOUNT_DISABLED.getMessage(),
                        ErrorCodes.ACCOUNT_DISABLED.getCode(),
                        ErrorCodes.ACCOUNT_DISABLED.getType()
                    ));
            }
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername());
            
            // Get user profile based on user type
            Map<String, Object> profileData = authService.getUserProfile(user);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "token", token,
                    "user", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName(),
                        "userType", user.getUserType().getValue(),
                        "isVerified", user.getIsVerified()
                    ),
                    "profile", profileData,
                    "message", "Login successful"
                )
            ));
        } catch (Exception e) {
            log.error("Login failed for username: {}", request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(
                    ErrorCodes.INVALID_CREDENTIALS.getMessage(),
                    ErrorCodes.INVALID_CREDENTIALS.getCode(),
                    ErrorCodes.INVALID_CREDENTIALS.getType()
                ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, Object>>> logout() {
        try {
            // Clear security context
            SecurityContextHolder.clearContext();
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of("message", "Logout successful")
            ));
        } catch (Exception e) {
            log.error("Logout error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Logout failed"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = authService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found"));
            }
            
            Map<String, Object> profileData = authService.getUserProfile(user);
            
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("firstName", user.getFirstName());
            userMap.put("lastName", user.getLastName());
            userMap.put("phoneNumber", user.getPhoneNumber());
            userMap.put("address", user.getAddress());
            userMap.put("city", user.getCity());
            userMap.put("state", user.getState());
            userMap.put("country", user.getCountry());
            userMap.put("postalCode", user.getPostalCode());
            userMap.put("userType", user.getUserType().getValue());
            userMap.put("isVerified", user.getIsVerified());
            userMap.put("isActive", user.getIsActive());
            userMap.put("createdAt", user.getCreatedAt());
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("user", userMap);
            responseMap.put("profile", profileData);
            
            return ResponseEntity.ok(ApiResponse.success(responseMap));
        } catch (Exception e) {
            log.error("Error getting profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to get profile"));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(@Valid @RequestBody UserUpdateRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = authService.updateUserProfile(username, request);
            
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("firstName", user.getFirstName());
            userMap.put("lastName", user.getLastName());
            userMap.put("phoneNumber", user.getPhoneNumber());
            userMap.put("address", user.getAddress());
            userMap.put("city", user.getCity());
            userMap.put("state", user.getState());
            userMap.put("country", user.getCountry());
            userMap.put("postalCode", user.getPostalCode());
            userMap.put("userType", user.getUserType().getValue());
            userMap.put("isVerified", user.getIsVerified());
            userMap.put("isActive", user.getIsActive());
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("user", userMap);
            responseMap.put("message", "Profile updated successfully");
            
            return ResponseEntity.ok(ApiResponse.success(responseMap));
        } catch (Exception e) {
            log.error("Error updating profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Failed to update profile: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Map<String, Object>>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            authService.changePassword(username, request);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of("message", "Password changed successfully")
            ));
        } catch (Exception e) {
            log.error("Error changing password: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Failed to change password: " + e.getMessage()));
        }
    }

    @GetMapping("/verify-token")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyToken() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = authService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid token"));
            }
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "valid", true,
                    "user", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "userType", user.getUserType().getValue(),
                        "isVerified", user.getIsVerified()
                    )
                )
            ));
        } catch (Exception e) {
            log.error("Token verification error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Invalid token"));
        }
    }
}
