package com.zoodo.backend.controller;

import com.zoodo.backend.model.User;
import com.zoodo.backend.service.UserService;
import com.zoodo.backend.dto.UserRegistrationRequest;
import com.zoodo.backend.dto.UserLoginRequest;
import com.zoodo.backend.dto.UserUpdateRequest;
import com.zoodo.backend.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Public endpoints (no authentication required)
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            User user = userService.registerUser(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "User registered successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> loginUser(@Valid @RequestBody UserLoginRequest request) {
        try {
            String token = userService.loginUser(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<User>>> getProviders(
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "50.0") Double maxDistance) {
        try {
            List<User> providers = userService.getProviders(userType, specialization, latitude, longitude, maxDistance);
            return ResponseEntity.ok(new ApiResponse<>(true, "Providers retrieved successfully", providers));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<User>>> searchUsers(
            @RequestParam String query,
            @RequestParam(required = false) String userType) {
        try {
            List<User> users = userService.searchUsers(query, userType);
            return ResponseEntity.ok(new ApiResponse<>(true, "Users found successfully", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // CRUD endpoints for frontend (no authentication required)
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(new ApiResponse<>(true, "Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            User user = userService.registerUser(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "User created successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable UUID userId, @Valid @RequestBody UserUpdateRequest request) {
        try {
            User updatedUser = userService.updateUser(userId, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "User updated successfully", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable UUID userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "User deleted successfully", "User deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // Protected endpoints (require authentication)
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<User>> getCurrentUserProfile() {
        try {
            User user = userService.getCurrentUser();
            return ResponseEntity.ok(new ApiResponse<>(true, "Profile retrieved successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<User>> updateUserProfile(@Valid @RequestBody UserUpdateRequest request) {
        try {
            User updatedUser = userService.updateUserProfile(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable UUID userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "User retrieved successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/providers/{providerId}")
    public ResponseEntity<ApiResponse<User>> getProviderById(@PathVariable UUID providerId) {
        try {
            User provider = userService.getProviderById(providerId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Provider retrieved successfully", provider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{userId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> verifyUser(@PathVariable UUID userId) {
        try {
            User verifiedUser = userService.verifyUser(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "User verified successfully", verifiedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
} 