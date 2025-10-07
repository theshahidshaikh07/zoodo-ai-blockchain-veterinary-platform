package com.zoodo.backend.service;

import com.zoodo.backend.dto.ChangePasswordRequest;
import com.zoodo.backend.dto.UserUpdateRequest;
import com.zoodo.backend.model.*;
import com.zoodo.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VeterinarianRepository veterinarianRepository;
    
    @Autowired
    private TrainerRepository trainerRepository;
    
    @Autowired
    private PetOwnerRepository petOwnerRepository;
    
    @Autowired
    private HospitalRepository hospitalRepository;
    
    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User getUserByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByEmail(usernameOrEmail)
            .or(() -> userRepository.findByUsername(usernameOrEmail))
            .orElse(null);
    }

    public Map<String, Object> getUserProfile(User user) {
        Map<String, Object> profile = new HashMap<>();
        
        switch (user.getUserType()) {
            case PET_OWNER:
                profile = getPetOwnerProfile(user);
                break;
            case VETERINARIAN:
                profile = getVeterinarianProfile(user);
                break;
            case TRAINER:
                profile = getTrainerProfile(user);
                break;
            case HOSPITAL:
            case CLINIC:
                profile = getHospitalProfile(user);
                break;
            default:
                profile.put("type", "unknown");
        }
        
        return profile;
    }

    private Map<String, Object> getPetOwnerProfile(User user) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("type", "pet_owner");
        
        // Get pet owner record
        Optional<PetOwner> petOwnerOpt = petOwnerRepository.findByUserId(user.getId());
        if (petOwnerOpt.isPresent()) {
            PetOwner petOwner = petOwnerOpt.get();
            profile.put("petOwnerId", petOwner.getId());
            profile.put("createdAt", petOwner.getCreatedAt());
        }
        
        // Get pets
        var pets = petRepository.findByOwnerId(user);
        profile.put("pets", pets.stream().map(pet -> {
            Map<String, Object> petMap = new HashMap<>();
            petMap.put("id", pet.getId());
            petMap.put("name", pet.getName());
            petMap.put("species", pet.getSpecies());
            petMap.put("breed", pet.getBreed());
            petMap.put("gender", pet.getGender() != null ? pet.getGender().getValue() : null);
            petMap.put("birthday", pet.getBirthday());
            petMap.put("age", pet.getAge());
            petMap.put("ageUnit", pet.getAgeUnit());
            petMap.put("weight", pet.getWeight());
            petMap.put("weightUnit", pet.getWeightUnit());
            petMap.put("microchip", pet.getMicrochip());
            petMap.put("sterilized", pet.getSterilized());
            petMap.put("photoUrl", pet.getPhotoUrl());
            return petMap;
        }).toList());
        
        profile.put("petCount", pets.size());
        
        return profile;
    }

    private Map<String, Object> getVeterinarianProfile(User user) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("type", "veterinarian");
        
        // Get veterinarian record
        Optional<Veterinarian> vetOpt = veterinarianRepository.findByUserId(user.getId());
        if (vetOpt.isPresent()) {
            Veterinarian vet = vetOpt.get();
            profile.put("veterinarianId", vet.getId());
            profile.put("licenseNumber", vet.getLicenseNumber());
            profile.put("experience", vet.getExperience());
            profile.put("specializations", vet.getSpecializations());
            profile.put("otherSpecialization", vet.getOtherSpecialization());
            profile.put("qualifications", vet.getQualifications());
            profile.put("otherQualification", vet.getOtherQualification());
            profile.put("licenseProofUrl", vet.getLicenseProofUrl());
            profile.put("idProofUrl", vet.getIdProofUrl());
            profile.put("degreeProofUrl", vet.getDegreeProofUrl());
            profile.put("profilePhotoUrl", vet.getProfilePhotoUrl());
            profile.put("isAffiliated", vet.getIsAffiliated());
            profile.put("affiliatedFacilityName", vet.getAffiliatedFacilityName());
            profile.put("affiliationType", vet.getAffiliationType());
            profile.put("otherFacilityName", vet.getOtherFacilityName());
            profile.put("offerHomeConsultation", vet.getOfferHomeConsultation());
            profile.put("offerOnlineConsultation", vet.getOfferOnlineConsultation());
            profile.put("independentServiceAddress", vet.getIndependentServiceAddress());
            profile.put("independentServiceSameAsPersonal", vet.getIndependentServiceSameAsPersonal());
            profile.put("independentServiceStreet", vet.getIndependentServiceStreet());
            profile.put("independentServiceCity", vet.getIndependentServiceCity());
            profile.put("independentServiceZip", vet.getIndependentServiceZip());
            profile.put("homeVisitRadius", vet.getHomeVisitRadius());
            profile.put("availabilitySchedule", vet.getAvailabilitySchedule());
            profile.put("createdAt", vet.getCreatedAt());
        }
        
        return profile;
    }

    private Map<String, Object> getTrainerProfile(User user) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("type", "trainer");
        
        // Get trainer record
        Optional<Trainer> trainerOpt = trainerRepository.findByUserId(user.getId());
        if (trainerOpt.isPresent()) {
            Trainer trainer = trainerOpt.get();
            profile.put("trainerId", trainer.getId());
            profile.put("experience", trainer.getExperience());
            profile.put("specializations", trainer.getSpecializations());
            profile.put("otherSpecialization", trainer.getOtherSpecialization());
            profile.put("certifications", trainer.getCertifications());
            profile.put("otherCertification", trainer.getOtherCertification());
            profile.put("resumeUrl", trainer.getResumeUrl());
            profile.put("profilePhotoUrl", trainer.getProfilePhotoUrl());
            profile.put("practiceType", trainer.getPracticeType());
            profile.put("offerHomeTraining", trainer.getOfferHomeTraining());
            profile.put("independentServiceAddress", trainer.getIndependentServiceAddress());
            profile.put("independentServiceSameAsPersonal", trainer.getIndependentServiceSameAsPersonal());
            profile.put("independentServiceStreet", trainer.getIndependentServiceStreet());
            profile.put("independentServiceCity", trainer.getIndependentServiceCity());
            profile.put("independentServiceZip", trainer.getIndependentServiceZip());
            profile.put("homeTrainingRadius", trainer.getHomeTrainingRadius());
            profile.put("hasTrainingCenter", trainer.getHasTrainingCenter());
            profile.put("trainingCenterName", trainer.getTrainingCenterName());
            profile.put("trainingCenterAddress", trainer.getTrainingCenterAddress());
            profile.put("trainingCenterOfferInPerson", trainer.getTrainingCenterOfferInPerson());
            profile.put("affiliatedFacilityName", trainer.getAffiliatedFacilityName());
            profile.put("affiliationType", trainer.getAffiliationType());
            profile.put("hasAcademy", trainer.getHasAcademy());
            profile.put("academyName", trainer.getAcademyName());
            profile.put("academyStreet", trainer.getAcademyStreet());
            profile.put("academyCity", trainer.getAcademyCity());
            profile.put("academyState", trainer.getAcademyState());
            profile.put("academyPostalCode", trainer.getAcademyPostalCode());
            profile.put("academyCountry", trainer.getAcademyCountry());
            profile.put("academyPhone", trainer.getAcademyPhone());
            profile.put("availabilitySchedule", trainer.getAvailabilitySchedule());
            profile.put("createdAt", trainer.getCreatedAt());
        }
        
        return profile;
    }

    private Map<String, Object> getHospitalProfile(User user) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("type", user.getUserType().getValue());
        
        // Get hospital record
        Optional<Hospital> hospitalOpt = hospitalRepository.findByUserId(user.getId());
        if (hospitalOpt.isPresent()) {
            Hospital hospital = hospitalOpt.get();
            profile.put("hospitalId", hospital.getId());
            profile.put("accountType", hospital.getAccountType());
            profile.put("businessName", hospital.getBusinessName());
            profile.put("contactPerson", hospital.getContactPerson());
            profile.put("offerOnlineConsultation", hospital.getOfferOnlineConsultation());
            profile.put("offerClinicHospital", hospital.getOfferClinicHospital());
            profile.put("facilityLicenseNumber", hospital.getFacilityLicenseNumber());
            profile.put("govtRegistrationNumber", hospital.getGovtRegistrationNumber());
            profile.put("taxId", hospital.getTaxId());
            profile.put("medicalDirectorName", hospital.getMedicalDirectorName());
            profile.put("medicalDirectorLicenseNumber", hospital.getMedicalDirectorLicenseNumber());
            profile.put("facilityLicenseDocumentUrl", hospital.getFacilityLicenseDocumentUrl());
            profile.put("isVerified", hospital.getIsVerified());
            profile.put("isActive", hospital.getIsActive());
            profile.put("createdAt", hospital.getCreatedAt());
        }
        
        return profile;
    }

    @Transactional
    public User updateUserProfile(String username, UserUpdateRequest request) {
        User user = getUserByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        
        // Update basic user information
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
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

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = getUserByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        log.info("Password changed for user: {}", username);
    }
}
