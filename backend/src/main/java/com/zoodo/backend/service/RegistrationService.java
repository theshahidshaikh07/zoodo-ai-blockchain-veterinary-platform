package com.zoodo.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.zoodo.backend.dto.*;
import com.zoodo.backend.model.*;
import com.zoodo.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

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
    private FileStorageService fileStorageService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public User registerPetOwner(PetOwnerRegistrationRequest request) {
        log.info("Registering pet owner: {}", request.getUsername());

        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setCountry(request.getCountry());
        user.setPostalCode(request.getPostalCode());
        user.setUserType(User.UserType.PET_OWNER);
        user.setIsVerified(false);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Create pet owner record
        PetOwner petOwner = new PetOwner(savedUser);
        petOwnerRepository.save(petOwner);

        // Save pets if provided
        if (request.getPets() != null && !request.getPets().isEmpty()) {
            for (PetOwnerRegistrationRequest.PetInfoDto petDto : request.getPets()) {
                Pet pet = new Pet();
                pet.setOwner(savedUser);
                pet.setName(petDto.getName());
                pet.setSpecies(petDto.getSpecies());
                pet.setBreed(petDto.getBreed());
                
                if (petDto.getGender() != null) {
                    pet.setGender(Pet.Gender.fromValue(petDto.getGender()));
                }
                
                if (petDto.getBirthday() != null && !petDto.getBirthday().isEmpty()) {
                    try {
                        pet.setBirthDate(LocalDate.parse(petDto.getBirthday()));
                    } catch (Exception e) {
                        log.warn("Invalid birthday format: {}", petDto.getBirthday());
                    }
                }
                
                pet.setAge(petDto.getAge());
                pet.setAgeUnit(petDto.getAgeUnit());
                pet.setWeight(petDto.getWeight());
                pet.setWeightUnit(petDto.getWeightUnit());
                pet.setMicrochipId(petDto.getMicrochip());
                
                if (petDto.getSterilized() != null) {
                    pet.setSterilized("yes".equals(petDto.getSterilized()));
                }
                
                pet.setPhotoUrl(petDto.getPhotoUrl());
                
                petRepository.save(pet);
            }
        }

        log.info("Pet owner registered successfully with ID: {}", savedUser.getId());
        return savedUser;
    }

    @Transactional
    public User registerVeterinarian(String registrationDataJson, 
                                   MultipartFile licenseProof, 
                                   MultipartFile idProof, 
                                   MultipartFile degreeProof, 
                                   MultipartFile profilePhoto) {
        try {
            VeterinarianRegistrationRequest request = objectMapper.readValue(registrationDataJson, VeterinarianRegistrationRequest.class);
            log.info("Registering veterinarian: {}", request.getUsername());

            // Check if username, email, or license already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username already exists");
            }
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }
            if (veterinarianRepository.existsByLicenseNumber(request.getLicenseNumber())) {
                throw new IllegalArgumentException("License number already exists");
            }

            // Create user
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhone(request.getPhoneNumber());
            user.setAddress(request.getAddress());
            user.setUserType(User.UserType.VETERINARIAN);
            user.setIsVerified(false); // Pending verification
            user.setIsActive(true);

            User savedUser = userRepository.save(user);

            // Handle file uploads
            String licenseProofUrl = null;
            String idProofUrl = null;
            String degreeProofUrl = null;
            String profilePhotoUrl = null;

            try {
                if (licenseProof != null && !licenseProof.isEmpty()) {
                    licenseProofUrl = fileStorageService.store("vet-documents", licenseProof);
                }
                if (idProof != null && !idProof.isEmpty()) {
                    idProofUrl = fileStorageService.store("vet-documents", idProof);
                }
                if (degreeProof != null && !degreeProof.isEmpty()) {
                    degreeProofUrl = fileStorageService.store("vet-documents", degreeProof);
                }
                if (profilePhoto != null && !profilePhoto.isEmpty()) {
                    profilePhotoUrl = fileStorageService.store("vet-photos", profilePhoto);
                }
            } catch (Exception e) {
                log.error("Error uploading files: {}", e.getMessage(), e);
                throw new RuntimeException("File upload failed", e);
            }

            // Create veterinarian profile
            Veterinarian veterinarian = new Veterinarian(savedUser, request.getLicenseNumber());
            veterinarian.setExperience(request.getExperience());
            veterinarian.setResumeUrl(null); // Resume not required for vets
            veterinarian.setLicenseProofUrl(licenseProofUrl);
            veterinarian.setIdProofUrl(idProofUrl);
            veterinarian.setDegreeProofUrl(degreeProofUrl);
            veterinarian.setProfilePhotoUrl(profilePhotoUrl);
            
            // Process specializations and qualifications
            List<String> specializations = request.getSpecializationList();
            if (request.hasCustomSpecialization()) {
                // Replace "Other" with custom specialization
                specializations = specializations.stream()
                    .map(s -> s.equals("Other") ? request.getOtherSpecialization() : s)
                    .filter(s -> s != null && !s.trim().isEmpty())
                    .collect(java.util.stream.Collectors.toList());
            }
            veterinarian.setSpecializations(specializations);

            List<String> qualifications = request.getQualificationList();
            if (request.hasCustomQualification()) {
                // Replace "Other" with custom qualification
                qualifications = qualifications.stream()
                    .map(q -> q.equals("Other") ? request.getOtherQualification() : q)
                    .filter(q -> q != null && !q.trim().isEmpty())
                    .collect(java.util.stream.Collectors.toList());
            }
            veterinarian.setQualifications(qualifications);

            // Affiliation details
            veterinarian.setIsAffiliated(request.getIsAffiliated());
            if (request.getIsAffiliated()) {
                veterinarian.setAffiliatedFacilityName(request.getAffiliatedFacilityName());
                veterinarian.setAffiliatedType(request.getAffiliatedType());
                if ("Other".equals(request.getAffiliatedFacilityName())) {
                    veterinarian.setOtherFacilityName(request.getOtherFacilityName());
                }
            }

            // Service offerings
            veterinarian.setOfferOnlineConsultation(request.getOfferOnlineConsultation());
            veterinarian.setOfferHomeVisits(request.getOfferHomeVisits());
            
            if (request.getOfferHomeVisits()) {
                veterinarian.setHomeServiceSameAsPersonal(request.getHomeServiceSameAsPersonal());
                if (!request.getHomeServiceSameAsPersonal()) {
                    veterinarian.setHomeServiceStreet(request.getHomeServiceStreet());
                    veterinarian.setHomeServiceCity(request.getHomeServiceCity());
                    veterinarian.setHomeServiceZip(request.getHomeServiceZip());
                }
                veterinarian.setHomeVisitRadius(request.getHomeVisitRadius());
            }

            // Store availability settings as JSON
            if (request.getAvailabilitySchedule() != null) {
                veterinarian.setAvailabilitySettings(request.getAvailabilitySchedule());
            }

            veterinarianRepository.save(veterinarian);

            log.info("Veterinarian registered successfully with ID: {}", savedUser.getId());
            return savedUser;

        } catch (JsonProcessingException e) {
            log.error("Error parsing veterinarian registration JSON: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Invalid registration data format", e);
        } catch (Exception e) {
            log.error("Error in veterinarian registration: {}", e.getMessage(), e);
            if (e instanceof IllegalArgumentException || e instanceof RuntimeException) {
                throw e;
            }
            throw new RuntimeException("Veterinarian registration failed", e);
        }
    }

    @Transactional
    public User registerTrainer(String registrationDataJson, MultipartFile resume, MultipartFile profilePhoto) {
        try {
            TrainerRegistrationRequest request = objectMapper.readValue(registrationDataJson, TrainerRegistrationRequest.class);
            log.info("Registering trainer: {}", request.getUsername());

            // Check if username or email already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username already exists");
            }
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }

            // Create user
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhone(request.getPhoneNumber());
            user.setAddress(request.getAddress());
            user.setUserType(User.UserType.TRAINER);
            user.setIsVerified(false); // Pending verification
            user.setIsActive(true);

            User savedUser = userRepository.save(user);

            // Handle file uploads
            String resumeUrl = null;
            String profilePhotoUrl = null;

            try {
                if (resume != null && !resume.isEmpty()) {
                    resumeUrl = fileStorageService.store("trainer-documents", resume);
                }
                if (profilePhoto != null && !profilePhoto.isEmpty()) {
                    profilePhotoUrl = fileStorageService.store("trainer-photos", profilePhoto);
                }
            } catch (Exception e) {
                log.error("Error uploading trainer files: {}", e.getMessage(), e);
                throw new RuntimeException("File upload failed", e);
            }

            // Create trainer profile
            Trainer trainer = new Trainer(savedUser);
            trainer.setExperience(request.getExperience());
            trainer.setResumeUrl(resumeUrl);
            trainer.setProfilePhotoUrl(profilePhotoUrl);
            
            // Process specializations and certifications
            List<String> specializations = request.getSpecializationList();
            if (request.hasCustomSpecialization()) {
                // Replace "Other" with custom specialization
                specializations = specializations.stream()
                    .map(s -> s.equals("Other") ? request.getOtherSpecialization() : s)
                    .filter(s -> s != null && !s.trim().isEmpty())
                    .toList();
            }
            trainer.setSpecializations(specializations);

            List<String> certifications = request.getCertificationList();
            if (request.hasCustomCertification()) {
                // Replace "Other" with custom certification
                certifications = certifications.stream()
                    .map(c -> c.equals("Other") ? request.getOtherCertification() : c)
                    .filter(c -> c != null && !c.trim().isEmpty())
                    .toList();
            }
            trainer.setCertifications(certifications);

            // Service offerings
            trainer.setOfferOnlineTraining(request.getOfferOnlineTraining());
            trainer.setOfferHomeTraining(request.getOfferHomeTraining());
            trainer.setOfferGroupClasses(request.getOfferGroupClasses());

            // Academy details
            trainer.setHasAcademy(request.getHasAcademy());
            if (request.getHasAcademy()) {
                trainer.setAcademyName(request.getAcademyName());
                trainer.setAcademyStreet(request.getAcademyStreet());
                trainer.setAcademyCity(request.getAcademyCity());
                trainer.setAcademyState(request.getAcademyState());
                trainer.setAcademyPostalCode(request.getAcademyPostalCode());
                trainer.setAcademyCountry(request.getAcademyCountry());
                trainer.setAcademyPhone(request.getAcademyPhone());
            }

            // Training center details
            trainer.setHasTrainingCenter(request.getHasTrainingCenter());
            if (request.getHasTrainingCenter()) {
                trainer.setTrainingCenterName(request.getTrainingCenterName());
                trainer.setTrainingCenterAddress(request.getTrainingCenterAddress());
            }

            // Independent practice details
            if (request.getOfferHomeTraining()) {
                trainer.setIndependentServiceSameAsPersonal(request.getIndependentServiceSameAsPersonal());
                if (!request.getIndependentServiceSameAsPersonal()) {
                    trainer.setIndependentServiceStreet(request.getIndependentServiceStreet());
                    trainer.setIndependentServiceCity(request.getIndependentServiceCity());
                    trainer.setIndependentServiceZip(request.getIndependentServiceZip());
                }
                trainer.setHomeTrainingRadius(request.getHomeTrainingRadius());
            }

            // Store availability settings as JSON
            if (request.getAvailabilitySchedule() != null) {
                trainer.setAvailabilitySettings(request.getAvailabilitySchedule());
            }

            trainerRepository.save(trainer);

            log.info("Trainer registered successfully with ID: {}", savedUser.getId());
            return savedUser;

        } catch (JsonProcessingException e) {
            log.error("Error parsing trainer registration JSON: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Invalid registration data format", e);
        } catch (Exception e) {
            log.error("Error in trainer registration: {}", e.getMessage(), e);
            if (e instanceof IllegalArgumentException || e instanceof RuntimeException) {
                throw e;
            }
            throw new RuntimeException("Trainer registration failed", e);
        }
    }

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    public boolean isLicenseAvailable(String licenseNumber) {
        return !veterinarianRepository.existsByLicenseNumber(licenseNumber);
    }

    @Transactional
    public User registerHospital(String registrationDataJson, MultipartFile facilityLicenseDocument) {
        try {
            HospitalRegistrationRequest request = objectMapper.readValue(registrationDataJson, HospitalRegistrationRequest.class);
            log.info("Registering hospital/clinic: {}", request.getUsername());

            // Check if username or email already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username already exists");
            }
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }
            if (hospitalRepository.existsByFacilityLicenseNumber(request.getFacilityLicenseNumber())) {
                throw new IllegalArgumentException("Facility license number already exists");
            }
            if (hospitalRepository.existsByGovtRegistrationNumber(request.getGovtRegistrationNumber())) {
                throw new IllegalArgumentException("Government registration number already exists");
            }
            if (hospitalRepository.existsByTaxId(request.getTaxId())) {
                throw new IllegalArgumentException("Tax ID already exists");
            }

            // Create user
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName()); // business name
            user.setLastName(request.getLastName()); // "Hospital" or "Clinic"
            user.setPhone(request.getPhoneNumber());
            user.setAddress(request.getAddress());
            user.setCity(request.getCity());
            user.setState(request.getState());
            user.setCountry(request.getCountry());
            user.setPostalCode(request.getPostalCode());
            user.setUserType(User.UserType.fromValue(request.getAccountType()));
            user.setIsVerified(false); // Pending verification
            user.setIsActive(true);

            User savedUser = userRepository.save(user);

            // Handle file upload
            String facilityLicenseDocumentUrl = null;
            try {
                if (facilityLicenseDocument != null && !facilityLicenseDocument.isEmpty()) {
                    facilityLicenseDocumentUrl = fileStorageService.store("hospital-documents", facilityLicenseDocument);
                }
            } catch (Exception e) {
                log.error("Error uploading facility license document: {}", e.getMessage(), e);
                throw new RuntimeException("File upload failed", e);
            }

            // Create hospital profile
            Hospital hospital = new Hospital(savedUser, request.getBusinessName(), request.getContactPerson(), request.getAccountType());
            hospital.setOfferOnlineConsultation(request.getOfferOnlineConsultation());
            hospital.setOfferClinicHospital(request.getOfferClinicHospital());
            hospital.setBusinessHours(request.getBusinessHours());
            hospital.setFacilityLicenseNumber(request.getFacilityLicenseNumber());
            hospital.setGovtRegistrationNumber(request.getGovtRegistrationNumber());
            hospital.setTaxId(request.getTaxId());
            hospital.setMedicalDirectorName(request.getMedicalDirectorName());
            hospital.setMedicalDirectorLicenseNumber(request.getMedicalDirectorLicenseNumber());
            hospital.setFacilityLicenseDocumentUrl(facilityLicenseDocumentUrl);
            hospital.setIsVerified(false); // Pending verification
            hospital.setIsActive(true);

            hospitalRepository.save(hospital);

            log.info("Hospital/Clinic registered successfully with ID: {}", savedUser.getId());
            return savedUser;

        } catch (JsonProcessingException e) {
            log.error("Error parsing hospital registration JSON: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Invalid registration data format", e);
        } catch (Exception e) {
            log.error("Error in hospital registration: {}", e.getMessage(), e);
            if (e instanceof IllegalArgumentException || e instanceof RuntimeException) {
                throw e;
            }
            throw new RuntimeException("Hospital registration failed", e);
        }
    }
}
