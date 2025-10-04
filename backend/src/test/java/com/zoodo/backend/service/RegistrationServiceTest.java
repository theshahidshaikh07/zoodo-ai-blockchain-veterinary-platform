package com.zoodo.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zoodo.backend.dto.PetOwnerRegistrationRequest;
import com.zoodo.backend.dto.VeterinarianRegistrationRequest;
import com.zoodo.backend.dto.TrainerRegistrationRequest;
import com.zoodo.backend.model.User;
import com.zoodo.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private VeterinarianRepository veterinarianRepository;
    
    @Mock
    private TrainerRepository trainerRepository;
    
    @Mock
    private PetOwnerRepository petOwnerRepository;
    
    @Mock
    private PetRepository petRepository;
    
    @Mock
    private FileStorageService fileStorageService;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private RegistrationService registrationService;

    private PetOwnerRegistrationRequest petOwnerRequest;
    private VeterinarianRegistrationRequest vetRequest;
    private TrainerRegistrationRequest trainerRequest;

    @BeforeEach
    void setUp() {
        // Setup Pet Owner Request
        petOwnerRequest = new PetOwnerRegistrationRequest();
        petOwnerRequest.setUsername("testowner");
        petOwnerRequest.setEmail("test@example.com");
        petOwnerRequest.setPassword("password123");
        petOwnerRequest.setFirstName("John");
        petOwnerRequest.setLastName("Doe");
        petOwnerRequest.setPhoneNumber("+1234567890");
        petOwnerRequest.setAddress("123 Main St");
        petOwnerRequest.setCity("Anytown");
        petOwnerRequest.setState("CA");
        petOwnerRequest.setCountry("USA");
        petOwnerRequest.setPostalCode("12345");
        
        PetOwnerRegistrationRequest.PetInfoDto pet = new PetOwnerRegistrationRequest.PetInfoDto();
        pet.setName("Buddy");
        pet.setSpecies("Dog");
        pet.setBreed("Golden Retriever");
        pet.setGender("male");
        pet.setBirthday("2020-01-15");
        pet.setAge(4);
        pet.setAgeUnit("Years");
        pet.setWeight(java.math.BigDecimal.valueOf(25.5));
        pet.setWeightUnit("Kgs");
        pet.setMicrochip("CHIP123456");
        pet.setSterilized("yes");
        
        petOwnerRequest.setPets(Arrays.asList(pet));

        // Setup Veterinarian Request
        vetRequest = new VeterinarianRegistrationRequest();
        vetRequest.setUsername("dr.smith");
        vetRequest.setEmail("dr.smith@example.com");
        vetRequest.setPassword("password123");
        vetRequest.setFirstName("Dr. Sarah");
        vetRequest.setLastName("Smith");
        vetRequest.setPhoneNumber("+1234567890");
        vetRequest.setAddress("456 Oak Ave");
        vetRequest.setLicenseNumber("VET123456");
        vetRequest.setExperience(5);
        vetRequest.setSpecialization(Arrays.asList("General Practice", "Surgery"));
        vetRequest.setQualifications(Arrays.asList("BVSc", "MVSc"));
        vetRequest.setOfferOnlineConsultation(true);
        vetRequest.setOfferHomeVisits(true);
        vetRequest.setHomeVisitRadius(20);

        // Setup Trainer Request
        trainerRequest = new TrainerRegistrationRequest();
        trainerRequest.setUsername("trainer.jane");
        trainerRequest.setEmail("trainer.jane@example.com");
        trainerRequest.setPassword("password123");
        trainerRequest.setFirstName("Jane");
        trainerRequest.setLastName("Doe");
        trainerRequest.setPhoneNumber("+1234567890");
        trainerRequest.setAddress("789 Pine St");
        trainerRequest.setExperience(3);
        trainerRequest.setSpecialization(Arrays.asList("Basic Obedience", "Behavioral"));
        trainerRequest.setCertifications(Arrays.asList("CPDT"));
        trainerRequest.setOfferOnlineTraining(true);
        trainerRequest.setOfferHomeTraining(true);
        trainerRequest.setHomeTrainingRadius(15);
    }

    @Test
    void testRegisterPetOwner_Success() {
        // Given
        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(new User());
        when(petOwnerRepository.save(any())).thenReturn(new com.zoodo.backend.model.PetOwner());
        when(petRepository.save(any())).thenReturn(new com.zoodo.backend.model.Pet());

        // When
        User result = registrationService.registerPetOwner(petOwnerRequest);

        // Then
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
        verify(petOwnerRepository).save(any());
        verify(petRepository, times(1)).save(any());
    }

    @Test
    void testRegisterPetOwner_UsernameExists() {
        // Given
        when(userRepository.existsByUsername(any())).thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            registrationService.registerPetOwner(petOwnerRequest);
        });
    }

    @Test
    void testRegisterPetOwner_EmailExists() {
        // Given
        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(userRepository.existsByEmail(any())).thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            registrationService.registerPetOwner(petOwnerRequest);
        });
    }

    @Test
    void testIsUsernameAvailable_Available() {
        // Given
        when(userRepository.existsByUsername("newuser")).thenReturn(false);

        // When
        boolean result = registrationService.isUsernameAvailable("newuser");

        // Then
        assertTrue(result);
    }

    @Test
    void testIsUsernameAvailable_NotAvailable() {
        // Given
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // When
        boolean result = registrationService.isUsernameAvailable("existinguser");

        // Then
        assertFalse(result);
    }

    @Test
    void testIsEmailAvailable_Available() {
        // Given
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);

        // When
        boolean result = registrationService.isEmailAvailable("new@example.com");

        // Then
        assertTrue(result);
    }

    @Test
    void testIsEmailAvailable_NotAvailable() {
        // Given
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // When
        boolean result = registrationService.isEmailAvailable("existing@example.com");

        // Then
        assertFalse(result);
    }

    @Test
    void testIsLicenseAvailable_Available() {
        // Given
        when(veterinarianRepository.existsByLicenseNumber("NEW123")).thenReturn(false);

        // When
        boolean result = registrationService.isLicenseAvailable("NEW123");

        // Then
        assertTrue(result);
    }

    @Test
    void testIsLicenseAvailable_NotAvailable() {
        // Given
        when(veterinarianRepository.existsByLicenseNumber("EXISTING123")).thenReturn(true);

        // When
        boolean result = registrationService.isLicenseAvailable("EXISTING123");

        // Then
        assertFalse(result);
    }
}
