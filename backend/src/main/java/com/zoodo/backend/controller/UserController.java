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
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.zoodo.backend.service.FileStorageService fileStorageService;

    @Autowired
    private com.zoodo.backend.repository.VetProfileRepository vetProfileRepository;

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

    // Veterinarian multipart registration (accepts files but persists only text fields for now)
    @PostMapping(value = "/register/veterinarian", consumes = { "multipart/form-data" })
    public ResponseEntity<ApiResponse<User>> registerVeterinarian(
            @RequestPart("username") String username,
            @RequestPart("firstName") String firstName,
            @RequestPart("lastName") String lastName,
            @RequestPart("email") String email,
            @RequestPart("password") String password,
            @RequestPart(value = "phoneNumber", required = false) String phoneNumber,
            @RequestPart(value = "address", required = false) String address,
            @RequestPart(value = "licenseNumber", required = false) String licenseNumber,
            @RequestPart(value = "specialization", required = false) java.util.List<String> specializationItems,
            @RequestPart(value = "qualifications", required = false) java.util.List<String> qualificationsItems,
            @RequestPart(value = "independentServices", required = false) String independentServicesJson,
            @RequestPart(value = "availabilitySchedule", required = false) String availabilityScheduleJson,
            @RequestPart(value = "licenseProof", required = false) MultipartFile licenseProof,
            @RequestPart(value = "idProof", required = false) MultipartFile idProof,
            @RequestPart(value = "degreeProof", required = false) MultipartFile degreeProof,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto
    ) {
        try {
            UserRegistrationRequest request = new UserRegistrationRequest();
            request.setEmail(email);
            request.setUsername(username);
            request.setPassword(password);
            request.setFirstName(firstName);
            request.setLastName(lastName);
            request.setUserType("veterinarian");
            request.setPhone(phoneNumber);
            request.setAddress(address);
            request.setLicenseNumber(licenseNumber);
            if (specializationItems != null && !specializationItems.isEmpty()) {
                request.setSpecialization(String.join(", ", specializationItems));
            }
            User user = userService.registerUser(request);

            String baseDir = "vets/" + user.getId();
            String licensePath = fileStorageService.store(baseDir, licenseProof);
            String idPath = fileStorageService.store(baseDir, idProof);
            String degreePath = fileStorageService.store(baseDir, degreeProof);
            String photoPath = fileStorageService.store(baseDir, profilePhoto);

            com.zoodo.backend.model.VetProfile profile = new com.zoodo.backend.model.VetProfile();
            profile.setUser(user);
            profile.setLicenseNumber(licenseNumber);
            if (specializationItems != null && !specializationItems.isEmpty()) {
                profile.setSpecializations(String.join(", ", specializationItems));
            }
            if (qualificationsItems != null && !qualificationsItems.isEmpty()) {
                profile.setQualifications(String.join(", ", qualificationsItems));
            }
            profile.setLicenseProofPath(licensePath);
            profile.setIdProofPath(idPath);
            profile.setDegreeProofPath(degreePath);
            profile.setProfilePhotoPath(photoPath);
            vetProfileRepository.save(profile);

            return ResponseEntity.ok(new ApiResponse<>(true, "Veterinarian registered successfully", user));
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<User>> getCurrentUserProfile() {
        try {
            User user = userService.getCurrentUser();
            return ResponseEntity.ok(new ApiResponse<>(true, "Profile retrieved successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
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

    @GetMapping("/providers/{providerId}/profile")
    public ResponseEntity<ApiResponse<com.zoodo.backend.dto.ProviderProfileResponse>> getProviderProfile(@PathVariable UUID providerId) {
        try {
            com.zoodo.backend.dto.ProviderProfileResponse resp = userService.getProviderProfile(providerId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Provider profile retrieved successfully", resp));
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