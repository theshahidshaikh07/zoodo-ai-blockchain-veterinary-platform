package com.zoodo.backend.service;

import com.zoodo.backend.dto.*;
import com.zoodo.backend.model.*;
import com.zoodo.backend.repository.*;
import com.zoodo.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VeterinarianRepository veterinarianRepository;
    
    @Autowired
    private TrainerRepository trainerRepository;
    
    @Autowired
    private PetOwnerRepository petOwnerRepository;
    
    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    public String adminLogin(AdminLoginRequest request) {
        log.info("Admin login attempt for: {}", request.getUsernameOrEmail());
        
        // Check if it's the default admin user
        if ("admin".equals(request.getUsernameOrEmail()) && "admin".equals(request.getPassword())) {
            // Create a temporary admin user for JWT generation
            User adminUser = new User();
            adminUser.setId(UUID.randomUUID());
            adminUser.setEmail("admin@zoodo.com");
            adminUser.setUserType(User.UserType.ADMIN);
            
            return jwtUtil.generateToken(adminUser.getId(), adminUser.getEmail(), "ADMIN");
        }
        
        // Check if it's a regular user with admin role
        User user = userRepository.findByEmail(request.getUsernameOrEmail())
            .or(() -> userRepository.findByUsername(request.getUsernameOrEmail()))
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!User.UserType.ADMIN.equals(user.getUserType())) {
            throw new RuntimeException("Access denied. Admin privileges required.");
        }
        
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        
        return jwtUtil.generateToken(user.getId(), user.getEmail(), "ADMIN");
    }

    public Page<UserSummaryDto> getAllUsers(int page, int size, String userType, String search, String status) {
        log.info("Fetching users - page: {}, size: {}, userType: {}, search: {}, status: {}", 
                page, size, userType, search, status);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Specification<User> spec = createUserSpecification(userType, search, status);
        
        Page<User> users = userRepository.findAll(spec, pageable);
        
        return users.map(this::convertToUserSummaryDto);
    }

    private Specification<User> createUserSpecification(String userType, String search, String status) {
        return (root, query, criteriaBuilder) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            
            // Filter by user type
            if (userType != null && !userType.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("userType"), User.UserType.valueOf(userType.toUpperCase())));
            }
            
            // Filter by status
            if (status != null && !status.isEmpty()) {
                if ("active".equals(status)) {
                    predicates.add(criteriaBuilder.isTrue(root.get("isActive")));
                } else if ("inactive".equals(status)) {
                    predicates.add(criteriaBuilder.isFalse(root.get("isActive")));
                } else if ("verified".equals(status)) {
                    predicates.add(criteriaBuilder.isTrue(root.get("isVerified")));
                } else if ("unverified".equals(status)) {
                    predicates.add(criteriaBuilder.isFalse(root.get("isVerified")));
                }
            }
            
            // Search functionality
            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), searchPattern)
                ));
            }
            
            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private UserSummaryDto convertToUserSummaryDto(User user) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhoneNumber());
        dto.setUserType(user.getUserType().getValue());
        dto.setStatus(user.getIsActive() ? "active" : "inactive");
        dto.setIsVerified(user.getIsVerified());
        dto.setIsActive(user.getIsActive());
        dto.setCity(user.getCity());
        dto.setState(user.getState());
        dto.setCountry(user.getCountry());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        
        // Calculate profile completion
        dto.setProfileCompletion(calculateProfileCompletion(user));
        
        // Add type-specific information
        addTypeSpecificInfo(dto, user);
        
        return dto;
    }

    private void addTypeSpecificInfo(UserSummaryDto dto, User user) {
        switch (user.getUserType()) {
            case VETERINARIAN:
                Optional<Veterinarian> vet = veterinarianRepository.findByUser(user);
                if (vet.isPresent()) {
                    Veterinarian veterinarian = vet.get();
                    dto.setLicenseNumber(veterinarian.getLicenseNumber());
                    dto.setExperience(veterinarian.getExperience());
                    dto.setSpecializations(veterinarian.getSpecializations() != null ? 
                        veterinarian.getSpecializations().toArray(new String[0]) : new String[0]);
                    dto.setQualifications(veterinarian.getQualifications() != null ? 
                        veterinarian.getQualifications().toArray(new String[0]) : new String[0]);
                }
                break;
            case TRAINER:
                Optional<Trainer> trainer = trainerRepository.findByUser(user);
                if (trainer.isPresent()) {
                    Trainer trainerEntity = trainer.get();
                    dto.setExperience(trainerEntity.getExperience());
                    dto.setSpecializations(trainerEntity.getSpecializations() != null ? 
                        trainerEntity.getSpecializations().toArray(new String[0]) : new String[0]);
                    dto.setCertifications(trainerEntity.getCertifications() != null ? 
                        trainerEntity.getCertifications().toArray(new String[0]) : new String[0]);
                }
                break;
            case PET_OWNER:
                List<Pet> pets = petRepository.findByOwnerId(user);
                dto.setPetCount(pets.size());
                break;
        }
    }

    private Integer calculateProfileCompletion(User user) {
        int totalFields = 8; // Basic fields
        int completedFields = 0;
        
        if (user.getUsername() != null && !user.getUsername().isEmpty()) completedFields++;
        if (user.getEmail() != null && !user.getEmail().isEmpty()) completedFields++;
        if (user.getFirstName() != null && !user.getFirstName().isEmpty()) completedFields++;
        if (user.getLastName() != null && !user.getLastName().isEmpty()) completedFields++;
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) completedFields++;
        if (user.getAddress() != null && !user.getAddress().isEmpty()) completedFields++;
        if (user.getCity() != null && !user.getCity().isEmpty()) completedFields++;
        if (user.getState() != null && !user.getState().isEmpty()) completedFields++;
        
        // Add type-specific fields
        switch (user.getUserType()) {
            case VETERINARIAN:
                totalFields += 3;
                Optional<Veterinarian> vet = veterinarianRepository.findByUser(user);
                if (vet.isPresent()) {
                    if (vet.get().getLicenseNumber() != null) completedFields++;
                    if (vet.get().getExperience() != null) completedFields++;
                    if (vet.get().getSpecializations() != null && !vet.get().getSpecializations().isEmpty()) completedFields++;
                }
                break;
            case TRAINER:
                totalFields += 2;
                Optional<Trainer> trainer = trainerRepository.findByUser(user);
                if (trainer.isPresent()) {
                    if (trainer.get().getExperience() != null) completedFields++;
                    if (trainer.get().getSpecializations() != null && !trainer.get().getSpecializations().isEmpty()) completedFields++;
                }
                break;
        }
        
        return (int) Math.round((double) completedFields / totalFields * 100);
    }

    public UserDetailDto getUserDetails(String userId) {
        log.info("Fetching user details for ID: {}", userId);
        
        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDetailDto dto = new UserDetailDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhoneNumber());
        dto.setUserType(user.getUserType().getValue());
        dto.setStatus(user.getIsActive() ? "active" : "inactive");
        dto.setIsVerified(user.getIsVerified());
        dto.setIsActive(user.getIsActive());
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setState(user.getState());
        dto.setCountry(user.getCountry());
        dto.setPostalCode(user.getPostalCode());
        dto.setLatitude(null); // Latitude field removed from User model
        dto.setLongitude(null); // Longitude field removed from User model
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setProfileCompletion(calculateProfileCompletion(user));
        
        // Add type-specific details
        addTypeSpecificDetails(dto, user);
        
        return dto;
    }

    private void addTypeSpecificDetails(UserDetailDto dto, User user) {
        switch (user.getUserType()) {
            case VETERINARIAN:
                Optional<Veterinarian> vet = veterinarianRepository.findByUser(user);
                if (vet.isPresent()) {
                    Veterinarian veterinarian = vet.get();
                    dto.setLicenseNumber(veterinarian.getLicenseNumber());
                    dto.setExperience(veterinarian.getExperience());
                    dto.setSpecializations(veterinarian.getSpecializations() != null ? 
                        veterinarian.getSpecializations().toArray(new String[0]) : new String[0]);
                    dto.setQualifications(veterinarian.getQualifications() != null ? 
                        veterinarian.getQualifications().toArray(new String[0]) : new String[0]);
                    dto.setResumeUrl(veterinarian.getResumeUrl());
                    dto.setProfilePhotoUrl(veterinarian.getProfilePhotoUrl());
                    dto.setLicenseProofUrl(veterinarian.getLicenseProofUrl());
                    dto.setIdProofUrl(veterinarian.getIdProofUrl());
                    dto.setDegreeProofUrl(veterinarian.getDegreeProofUrl());
                    dto.setIsAffiliated(veterinarian.getIsAffiliated());
                    dto.setAffiliatedFacilityName(veterinarian.getAffiliatedFacilityName());
                    dto.setAffiliatedType(veterinarian.getAffiliationType());
                    dto.setOtherFacilityName(veterinarian.getOtherFacilityName());
                    dto.setOfferOnlineConsultation(veterinarian.getOfferOnlineConsultation());
                    dto.setOfferHomeConsultation(veterinarian.getOfferHomeConsultation());
                    dto.setHomeServiceAddress(veterinarian.getIndependentServiceAddress());
                    dto.setHomeServiceSameAsPersonal(veterinarian.getIndependentServiceSameAsPersonal());
                    dto.setHomeServiceStreet(veterinarian.getIndependentServiceStreet());
                    dto.setHomeServiceCity(veterinarian.getIndependentServiceCity());
                    dto.setHomeServiceZip(veterinarian.getIndependentServiceZip());
                    dto.setHomeVisitRadius(veterinarian.getHomeVisitRadius());
                    dto.setAvailabilitySettings(veterinarian.getAvailabilitySchedule());
                }
                break;
            case TRAINER:
                Optional<Trainer> trainer = trainerRepository.findByUser(user);
                if (trainer.isPresent()) {
                    Trainer trainerEntity = trainer.get();
                    dto.setExperience(trainerEntity.getExperience());
                    dto.setSpecializations(trainerEntity.getSpecializations() != null ? 
                        trainerEntity.getSpecializations().toArray(new String[0]) : new String[0]);
                    dto.setCertifications(trainerEntity.getCertifications() != null ? 
                        trainerEntity.getCertifications().toArray(new String[0]) : new String[0]);
                    dto.setResumeUrl(trainerEntity.getResumeUrl());
                    dto.setProfilePhotoUrl(trainerEntity.getProfilePhotoUrl());
                    dto.setPracticeType(trainerEntity.getPracticeType());
                    dto.setOfferHomeTraining(trainerEntity.getOfferHomeTraining());
                    dto.setIndependentServiceAddress(trainerEntity.getIndependentServiceAddress());
                    dto.setIndependentServiceSameAsPersonal(trainerEntity.getIndependentServiceSameAsPersonal());
                    dto.setIndependentServiceStreet(trainerEntity.getIndependentServiceStreet());
                    dto.setIndependentServiceCity(trainerEntity.getIndependentServiceCity());
                    dto.setIndependentServiceZip(trainerEntity.getIndependentServiceZip());
                    dto.setHomeTrainingRadius(trainerEntity.getHomeTrainingRadius());
                    dto.setHasTrainingCenter(trainerEntity.getHasTrainingCenter());
                    dto.setTrainingCenterName(trainerEntity.getTrainingCenterName());
                    dto.setTrainingCenterAddress(trainerEntity.getTrainingCenterAddress());
                    dto.setHasAcademy(trainerEntity.getHasAcademy());
                    dto.setAcademyName(trainerEntity.getAcademyName());
                    dto.setAcademyStreet(trainerEntity.getAcademyStreet());
                    dto.setAcademyCity(trainerEntity.getAcademyCity());
                    dto.setAcademyState(trainerEntity.getAcademyState());
                    dto.setAcademyPostalCode(trainerEntity.getAcademyPostalCode());
                    dto.setAcademyCountry(trainerEntity.getAcademyCountry());
                    dto.setAcademyPhone(trainerEntity.getAcademyPhone());
                    dto.setAvailabilitySettings(trainerEntity.getAvailabilitySchedule());
                }
                break;
            case PET_OWNER:
                List<Pet> pets = petRepository.findByOwnerId(user);
                dto.setPets(pets.stream().map(this::convertToPetSummaryDto).collect(Collectors.toList()));
                break;
        }
    }

    private UserDetailDto.PetSummaryDto convertToPetSummaryDto(Pet pet) {
        UserDetailDto.PetSummaryDto dto = new UserDetailDto.PetSummaryDto();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setSpecies(pet.getSpecies());
        dto.setBreed(pet.getBreed());
        dto.setGender(pet.getGender() != null ? pet.getGender().getValue() : null);
        dto.setBirthDate(pet.getBirthday() != null ? pet.getBirthday().atStartOfDay() : null);
        dto.setAge(pet.getAge());
        dto.setAgeUnit(pet.getAgeUnit());
        dto.setWeight(pet.getWeight() != null ? pet.getWeight().doubleValue() : null);
        dto.setWeightUnit(pet.getWeightUnit());
        dto.setMicrochipId(pet.getMicrochip());
        dto.setSterilized(pet.getSterilized());
        dto.setPhotoUrl(pet.getPhotoUrl());
        dto.setCreatedAt(pet.getCreatedAt());
        return dto;
    }

    @Transactional
    public void updateUserStatus(String userId, String status) {
        log.info("Updating user status for ID: {} to {}", userId, status);
        
        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if ("active".equals(status)) {
            user.setIsActive(true);
        } else if ("inactive".equals(status)) {
            user.setIsActive(false);
        } else if ("suspended".equals(status)) {
            user.setIsActive(false);
            // Could add additional suspension logic here
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String userId) {
        log.info("Deleting user with ID: {}", userId);
        
        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Delete related records first
        switch (user.getUserType()) {
            case VETERINARIAN:
                veterinarianRepository.findByUser(user).ifPresent(veterinarianRepository::delete);
                break;
            case TRAINER:
                trainerRepository.findByUser(user).ifPresent(trainerRepository::delete);
                break;
            case PET_OWNER:
                petOwnerRepository.findByUser(user).ifPresent(petOwnerRepository::delete);
                // Delete pets
                petRepository.findByOwnerId(user).forEach(petRepository::delete);
                break;
        }
        
        // Delete the user
        userRepository.delete(user);
    }

    public Map<String, Object> getSystemStats() {
        log.info("Fetching system statistics");
        
        Map<String, Object> stats = new HashMap<>();
        
        // Total counts
        stats.put("totalUsers", userRepository.count());
        stats.put("totalVeterinarians", userRepository.countByUserType(User.UserType.VETERINARIAN));
        stats.put("totalTrainers", userRepository.countByUserType(User.UserType.TRAINER));
        stats.put("totalPetOwners", userRepository.countByUserType(User.UserType.PET_OWNER));
        stats.put("totalPets", petRepository.count());
        
        // Active users
        stats.put("activeUsers", userRepository.countByIsActiveTrue());
        stats.put("verifiedUsers", userRepository.countByIsVerifiedTrue());
        
        // Recent registrations (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        stats.put("recentRegistrations", userRepository.countByCreatedAtAfter(thirtyDaysAgo));
        
        // User type distribution
        Map<String, Long> userTypeDistribution = new HashMap<>();
        for (User.UserType type : User.UserType.values()) {
            userTypeDistribution.put(type.getValue(), userRepository.countByUserType(type));
        }
        stats.put("userTypeDistribution", userTypeDistribution);
        
        return stats;
    }

    public List<UserSummaryDto> exportUsers(String userType, String status) {
        log.info("Exporting users - userType: {}, status: {}", userType, status);
        
        Specification<User> spec = createUserSpecification(userType, null, status);
        List<User> users = userRepository.findAll(spec, Sort.by("createdAt").descending());
        
        return users.stream()
            .map(this::convertToUserSummaryDto)
            .collect(Collectors.toList());
    }
}
