package com.zoodo.backend.service;

import com.zoodo.backend.model.User;
import com.zoodo.backend.model.VetProfile;
import com.zoodo.backend.repository.UserRepository;
import com.zoodo.backend.repository.VetProfileRepository;
import com.zoodo.backend.dto.ProviderProfileResponse;
import com.zoodo.backend.dto.UserRegistrationRequest;
import com.zoodo.backend.dto.UserLoginRequest;
import com.zoodo.backend.dto.UserUpdateRequest;
import com.zoodo.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private VetProfileRepository vetProfileRepository;

    // New CRUD methods for frontend
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(UUID userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        
        return userRepository.save(user);
    }

    // Existing methods
    public User registerUser(UserRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        if (request.getUsername() != null && userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash password
        user.setUserType(User.UserType.valueOf(request.getUserType().toUpperCase()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setSpecialization(request.getSpecialization());
        user.setExperience(request.getLicenseNumber()); // Using licenseNumber as experience for now
        user.setIsVerified(false);
        user.setIsActive(true);
        
        return userRepository.save(user);
    }

    public String loginUser(UserLoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Check if user is active
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        
        // Generate JWT token
        return jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUserType().name());
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserProfile(UserUpdateRequest request) {
        // TODO: Implement update user profile logic
        throw new UnsupportedOperationException("Update user profile not implemented yet");
    }

    public List<User> getProviders(String userType, String specialization, Double latitude, Double longitude, Double maxDistance) {
        // TODO: Implement get providers logic
        throw new UnsupportedOperationException("Get providers not implemented yet");
    }

    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getProviderById(UUID providerId) {
        return userRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Provider not found"));
    }

    public User verifyUser(UUID userId) {
        // TODO: Implement verify user logic
        throw new UnsupportedOperationException("Verify user not implemented yet");
    }

    public void deleteUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }

    public List<User> searchUsers(String query, String userType) {
        // TODO: Implement search users logic
        throw new UnsupportedOperationException("Search users not implemented yet");
    }

    public ProviderProfileResponse getProviderProfile(UUID providerId) {
        User user = getProviderById(providerId);
        VetProfile vet = vetProfileRepository.findByUserId(providerId).orElse(null);
        ProviderProfileResponse resp = new ProviderProfileResponse();
        resp.setId(user.getId().toString());
        resp.setFirstName(user.getFirstName());
        resp.setLastName(user.getLastName());
        resp.setEmail(user.getEmail());
        resp.setUsername(user.getUsername());
        resp.setPhone(user.getPhone());
        resp.setAddress(user.getAddress());
        resp.setUserType(user.getUserType().name());
        if (vet != null) {
            resp.setSpecializations(vet.getSpecializations());
            resp.setQualifications(vet.getQualifications());
            resp.setLicenseNumber(vet.getLicenseNumber());
            resp.setLicenseProofPath(vet.getLicenseProofPath());
            resp.setIdProofPath(vet.getIdProofPath());
            resp.setDegreeProofPath(vet.getDegreeProofPath());
            resp.setProfilePhotoPath(vet.getProfilePhotoPath());
        } else {
            resp.setSpecializations(user.getSpecialization());
        }
        return resp;
    }
} 