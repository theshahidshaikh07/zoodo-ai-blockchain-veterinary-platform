package com.zoodo.backend.service;

import com.zoodo.backend.model.User;
import com.zoodo.backend.repository.UserRepository;
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
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        if (request.getState() != null) {
            user.setState(request.getState());
        }
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }
        if (request.getPostalCode() != null) {
            user.setPostalCode(request.getPostalCode());
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
        user.setPasswordHash(passwordEncoder.encode(request.getPassword())); // Hash password
        user.setUserType(User.UserType.valueOf(request.getUserType().toUpperCase()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setCountry(request.getCountry());
        user.setPostalCode(request.getPostalCode());
        // Specialization and experience are handled in specific user type models
        user.setIsVerified(false);
        user.setIsActive(true);
        
        return userRepository.save(user);
    }

    public String loginUser(UserLoginRequest request) {
        // Find user by email or username
        User user = userRepository.findByEmail(request.getEmail())
            .or(() -> userRepository.findByUsername(request.getEmail()))
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
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
        ProviderProfileResponse resp = new ProviderProfileResponse();
        resp.setId(user.getId().toString());
        resp.setFirstName(user.getFirstName());
        resp.setLastName(user.getLastName());
        resp.setEmail(user.getEmail());
        resp.setUsername(user.getUsername());
        resp.setPhone(user.getPhoneNumber());
        resp.setAddress(user.getAddress());
        resp.setCity(user.getCity());
        resp.setState(user.getState());
        resp.setCountry(user.getCountry());
        resp.setPostalCode(user.getPostalCode());
        resp.setUserType(user.getUserType().name());
        // Specializations and other details are now handled in specific user type models
        // This method should be updated to use the new Veterinarian, Trainer, or Hospital models
        return resp;
    }
} 