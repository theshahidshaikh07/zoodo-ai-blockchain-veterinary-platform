package com.zoodo.backend.service;

import com.zoodo.backend.model.PetOwnerRegistration;
import com.zoodo.backend.model.User;
import com.zoodo.backend.repository.PetOwnerRegistrationRepository;
import com.zoodo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PetOwnerRegistrationService {

    @Autowired
    private PetOwnerRegistrationRepository petOwnerRegistrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Create a new pet owner registration
     */
    public PetOwnerRegistration createRegistration(PetOwnerRegistration registration) {
        // Check if email already exists
        if (petOwnerRegistrationRepository.findByEmail(registration.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Check if username already exists
        if (petOwnerRegistrationRepository.findByUsername(registration.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Encode password
        registration.setPasswordHash(passwordEncoder.encode(registration.getPasswordHash()));

        // Set default status
        registration.setRegistrationStatus(PetOwnerRegistration.RegistrationStatus.PENDING);

        return petOwnerRegistrationRepository.save(registration);
    }

    /**
     * Update an existing pet owner registration
     */
    public PetOwnerRegistration updateRegistration(UUID id, PetOwnerRegistration updatedRegistration) {
        PetOwnerRegistration existingRegistration = petOwnerRegistrationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));

        // Check if email already exists (excluding current registration)
        if (!existingRegistration.getEmail().equals(updatedRegistration.getEmail()) &&
            petOwnerRegistrationRepository.existsByEmailExcludingId(updatedRegistration.getEmail(), id)) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Check if username already exists (excluding current registration)
        if (!existingRegistration.getUsername().equals(updatedRegistration.getUsername()) &&
            petOwnerRegistrationRepository.existsByUsernameExcludingId(updatedRegistration.getUsername(), id)) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Update fields
        existingRegistration.setFirstName(updatedRegistration.getFirstName());
        existingRegistration.setLastName(updatedRegistration.getLastName());
        existingRegistration.setEmail(updatedRegistration.getEmail());
        existingRegistration.setUsername(updatedRegistration.getUsername());
        existingRegistration.setAddressLine1(updatedRegistration.getAddressLine1());
        existingRegistration.setAddressLine2(updatedRegistration.getAddressLine2());
        existingRegistration.setCity(updatedRegistration.getCity());
        existingRegistration.setState(updatedRegistration.getState());
        existingRegistration.setPostalCode(updatedRegistration.getPostalCode());
        existingRegistration.setCountry(updatedRegistration.getCountry());
        existingRegistration.setPetsData(updatedRegistration.getPetsData());

        // Update password if provided
        if (updatedRegistration.getPasswordHash() != null && !updatedRegistration.getPasswordHash().isEmpty()) {
            existingRegistration.setPasswordHash(passwordEncoder.encode(updatedRegistration.getPasswordHash()));
        }

        return petOwnerRegistrationRepository.save(existingRegistration);
    }

    /**
     * Get registration by ID
     */
    public Optional<PetOwnerRegistration> getRegistrationById(UUID id) {
        return petOwnerRegistrationRepository.findById(id);
    }

    /**
     * Get registration by email
     */
    public Optional<PetOwnerRegistration> getRegistrationByEmail(String email) {
        return petOwnerRegistrationRepository.findByEmail(email);
    }

    /**
     * Get registration by username
     */
    public Optional<PetOwnerRegistration> getRegistrationByUsername(String username) {
        return petOwnerRegistrationRepository.findByUsername(username);
    }

    /**
     * Get all registrations by status
     */
    public List<PetOwnerRegistration> getRegistrationsByStatus(PetOwnerRegistration.RegistrationStatus status) {
        return petOwnerRegistrationRepository.findByRegistrationStatus(status);
    }

    /**
     * Get all active registrations
     */
    public List<PetOwnerRegistration> getActiveRegistrations() {
        return petOwnerRegistrationRepository.findByIsActiveTrue();
    }

    /**
     * Approve a registration and create user account
     */
    public User approveRegistration(UUID registrationId) {
        PetOwnerRegistration registration = petOwnerRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));

        if (registration.getRegistrationStatus() != PetOwnerRegistration.RegistrationStatus.PENDING) {
            throw new IllegalArgumentException("Registration is not in pending status");
        }

        // Create user account
        User user = new User();
        user.setUsername(registration.getUsername());
        user.setEmail(registration.getEmail());
        user.setPasswordHash(registration.getPasswordHash());
        user.setFirstName(registration.getFirstName());
        user.setLastName(registration.getLastName());
        user.setUserType(User.UserType.PET_OWNER);
        user.setAddress(registration.getAddressLine1() + (registration.getAddressLine2() != null ? ", " + registration.getAddressLine2() : ""));
        user.setCity(registration.getCity());
        user.setState(registration.getState());
        user.setCountry(registration.getCountry());
        user.setPostalCode(registration.getPostalCode());
        user.setIsVerified(true);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Update registration status
        registration.setRegistrationStatus(PetOwnerRegistration.RegistrationStatus.APPROVED);
        registration.setUser(savedUser);
        petOwnerRegistrationRepository.save(registration);

        return savedUser;
    }

    /**
     * Reject a registration
     */
    public PetOwnerRegistration rejectRegistration(UUID registrationId, String reason) {
        PetOwnerRegistration registration = petOwnerRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));

        if (registration.getRegistrationStatus() != PetOwnerRegistration.RegistrationStatus.PENDING) {
            throw new IllegalArgumentException("Registration is not in pending status");
        }

        registration.setRegistrationStatus(PetOwnerRegistration.RegistrationStatus.REJECTED);
        registration.setVerificationNotes(reason);

        return petOwnerRegistrationRepository.save(registration);
    }

    /**
     * Delete a registration
     */
    public void deleteRegistration(UUID id) {
        PetOwnerRegistration registration = petOwnerRegistrationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));

        petOwnerRegistrationRepository.delete(registration);
    }

    /**
     * Get registrations by city
     */
    public List<PetOwnerRegistration> getRegistrationsByCity(String city) {
        return petOwnerRegistrationRepository.findByCityIgnoreCase(city);
    }

    /**
     * Get registrations by country
     */
    public List<PetOwnerRegistration> getRegistrationsByCountry(String country) {
        return petOwnerRegistrationRepository.findByCountryIgnoreCase(country);
    }
}
