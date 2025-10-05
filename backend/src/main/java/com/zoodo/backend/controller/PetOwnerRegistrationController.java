package com.zoodo.backend.controller;

import com.zoodo.backend.model.PetOwnerRegistration;
import com.zoodo.backend.model.User;
import com.zoodo.backend.service.PetOwnerRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/registrations/pet-owner")
@CrossOrigin(origins = "*")
public class PetOwnerRegistrationController {

    @Autowired
    private PetOwnerRegistrationService petOwnerRegistrationService;

    /**
     * Create a new pet owner registration
     */
    @PostMapping
    public ResponseEntity<?> createRegistration(@RequestBody PetOwnerRegistration registration) {
        try {
            PetOwnerRegistration createdRegistration = petOwnerRegistrationService.createRegistration(registration);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRegistration);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred while creating registration"));
        }
    }

    /**
     * Update an existing pet owner registration
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRegistration(@PathVariable UUID id, @RequestBody PetOwnerRegistration registration) {
        try {
            PetOwnerRegistration updatedRegistration = petOwnerRegistrationService.updateRegistration(id, registration);
            return ResponseEntity.ok(updatedRegistration);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred while updating registration"));
        }
    }

    /**
     * Get registration by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRegistrationById(@PathVariable UUID id) {
        Optional<PetOwnerRegistration> registration = petOwnerRegistrationService.getRegistrationById(id);
        if (registration.isPresent()) {
            return ResponseEntity.ok(registration.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get registration by email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getRegistrationByEmail(@PathVariable String email) {
        Optional<PetOwnerRegistration> registration = petOwnerRegistrationService.getRegistrationByEmail(email);
        if (registration.isPresent()) {
            return ResponseEntity.ok(registration.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get registration by username
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<?> getRegistrationByUsername(@PathVariable String username) {
        Optional<PetOwnerRegistration> registration = petOwnerRegistrationService.getRegistrationByUsername(username);
        if (registration.isPresent()) {
            return ResponseEntity.ok(registration.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all registrations by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PetOwnerRegistration>> getRegistrationsByStatus(@PathVariable String status) {
        try {
            PetOwnerRegistration.RegistrationStatus registrationStatus = 
                PetOwnerRegistration.RegistrationStatus.fromValue(status);
            List<PetOwnerRegistration> registrations = petOwnerRegistrationService.getRegistrationsByStatus(registrationStatus);
            return ResponseEntity.ok(registrations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all active registrations
     */
    @GetMapping("/active")
    public ResponseEntity<List<PetOwnerRegistration>> getActiveRegistrations() {
        List<PetOwnerRegistration> registrations = petOwnerRegistrationService.getActiveRegistrations();
        return ResponseEntity.ok(registrations);
    }

    /**
     * Approve a registration and create user account
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveRegistration(@PathVariable UUID id) {
        try {
            User user = petOwnerRegistrationService.approveRegistration(id);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred while approving registration"));
        }
    }

    /**
     * Reject a registration
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectRegistration(@PathVariable UUID id, @RequestBody RejectRequest request) {
        try {
            PetOwnerRegistration registration = petOwnerRegistrationService.rejectRegistration(id, request.getReason());
            return ResponseEntity.ok(registration);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred while rejecting registration"));
        }
    }

    /**
     * Delete a registration
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRegistration(@PathVariable UUID id) {
        try {
            petOwnerRegistrationService.deleteRegistration(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred while deleting registration"));
        }
    }

    /**
     * Get registrations by city
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<PetOwnerRegistration>> getRegistrationsByCity(@PathVariable String city) {
        List<PetOwnerRegistration> registrations = petOwnerRegistrationService.getRegistrationsByCity(city);
        return ResponseEntity.ok(registrations);
    }

    /**
     * Get registrations by country
     */
    @GetMapping("/country/{country}")
    public ResponseEntity<List<PetOwnerRegistration>> getRegistrationsByCountry(@PathVariable String country) {
        List<PetOwnerRegistration> registrations = petOwnerRegistrationService.getRegistrationsByCountry(country);
        return ResponseEntity.ok(registrations);
    }

    // Inner classes for request/response
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class RejectRequest {
        private String reason;

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}
