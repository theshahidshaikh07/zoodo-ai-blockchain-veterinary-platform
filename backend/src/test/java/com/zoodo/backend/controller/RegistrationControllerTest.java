package com.zoodo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zoodo.backend.dto.PetOwnerRegistrationRequest;
import com.zoodo.backend.model.User;
import com.zoodo.backend.service.RegistrationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationControllerTest {

    @Mock
    private RegistrationService registrationService;

    @InjectMocks
    private RegistrationController registrationController;

    private PetOwnerRegistrationRequest petOwnerRequest;
    private User mockUser;

    @BeforeEach
    void setUp() {
        petOwnerRequest = new PetOwnerRegistrationRequest();
        petOwnerRequest.setUsername("testowner");
        petOwnerRequest.setEmail("test@example.com");
        petOwnerRequest.setPassword("password123");
        petOwnerRequest.setFirstName("John");
        petOwnerRequest.setLastName("Doe");
        petOwnerRequest.setPhoneNumber("+1234567890");
        petOwnerRequest.setAddress("123 Main St");

        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setUsername("testowner");
        mockUser.setEmail("test@example.com");
        mockUser.setUserType(User.UserType.PET_OWNER);
    }

    @Test
    void testRegisterPetOwner_Success() {
        // Given
        when(registrationService.registerPetOwner(any(PetOwnerRegistrationRequest.class)))
            .thenReturn(mockUser);

        // When
        ResponseEntity<?> response = registrationController.registerPetOwner(petOwnerRequest);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(registrationService).registerPetOwner(any(PetOwnerRegistrationRequest.class));
    }

    @Test
    void testRegisterPetOwner_Exception() {
        // Given
        when(registrationService.registerPetOwner(any(PetOwnerRegistrationRequest.class)))
            .thenThrow(new IllegalArgumentException("Username already exists"));

        // When
        ResponseEntity<?> response = registrationController.registerPetOwner(petOwnerRequest);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testCheckUsernameAvailability_Available() {
        // Given
        when(registrationService.isUsernameAvailable("newuser")).thenReturn(true);

        // When
        ResponseEntity<?> response = registrationController.checkUsernameAvailability("newuser");

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(registrationService).isUsernameAvailable("newuser");
    }

    @Test
    void testCheckEmailAvailability_Available() {
        // Given
        when(registrationService.isEmailAvailable("new@example.com")).thenReturn(true);

        // When
        ResponseEntity<?> response = registrationController.checkEmailAvailability("new@example.com");

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(registrationService).isEmailAvailable("new@example.com");
    }

    @Test
    void testCheckLicenseAvailability_Available() {
        // Given
        when(registrationService.isLicenseAvailable("VET123456")).thenReturn(true);

        // When
        ResponseEntity<?> response = registrationController.checkLicenseAvailability("VET123456");

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(registrationService).isLicenseAvailable("VET123456");
    }
}
