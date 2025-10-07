package com.zoodo.backend.service;

import com.zoodo.backend.model.*;
import com.zoodo.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    @Autowired
    private VeterinarianRepository veterinarianRepository;
    
    @Autowired
    private TrainerRepository trainerRepository;
    
    @Autowired
    private HospitalRepository hospitalRepository;
    
    @Autowired
    private FileStorageService fileStorageService;

    public Map<String, Object> getProfessionalProfile(User user) {
        Map<String, Object> profile = new HashMap<>();
        
        switch (user.getUserType()) {
            case VETERINARIAN:
                profile = getVeterinarianProfessionalProfile(user);
                break;
            case TRAINER:
                profile = getTrainerProfessionalProfile(user);
                break;
            case HOSPITAL:
            case CLINIC:
                profile = getHospitalProfessionalProfile(user);
                break;
            default:
                profile.put("message", "Professional profile not available for this user type");
        }
        
        return profile;
    }

    private Map<String, Object> getVeterinarianProfessionalProfile(User user) {
        Map<String, Object> profile = new HashMap<>();
        
        Optional<Veterinarian> vetOpt = veterinarianRepository.findByUserId(user.getId());
        if (vetOpt.isPresent()) {
            Veterinarian vet = vetOpt.get();
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
        }
        
        return profile;
    }

    private Map<String, Object> getTrainerProfessionalProfile(User user) {
        Map<String, Object> profile = new HashMap<>();
        
        Optional<Trainer> trainerOpt = trainerRepository.findByUserId(user.getId());
        if (trainerOpt.isPresent()) {
            Trainer trainer = trainerOpt.get();
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
        }
        
        return profile;
    }

    private Map<String, Object> getHospitalProfessionalProfile(User user) {
        Map<String, Object> profile = new HashMap<>();
        
        Optional<Hospital> hospitalOpt = hospitalRepository.findByUserId(user.getId());
        if (hospitalOpt.isPresent()) {
            Hospital hospital = hospitalOpt.get();
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
        }
        
        return profile;
    }

    @Transactional
    public Map<String, Object> updateProfessionalProfile(User user, Map<String, Object> profileData) {
        Map<String, Object> updatedProfile = new HashMap<>();
        
        switch (user.getUserType()) {
            case VETERINARIAN:
                updatedProfile = updateVeterinarianProfile(user, profileData);
                break;
            case TRAINER:
                updatedProfile = updateTrainerProfile(user, profileData);
                break;
            case HOSPITAL:
            case CLINIC:
                updatedProfile = updateHospitalProfile(user, profileData);
                break;
            default:
                updatedProfile.put("message", "Professional profile update not available for this user type");
        }
        
        return updatedProfile;
    }

    private Map<String, Object> updateVeterinarianProfile(User user, Map<String, Object> profileData) {
        Optional<Veterinarian> vetOpt = veterinarianRepository.findByUserId(user.getId());
        if (vetOpt.isPresent()) {
            Veterinarian vet = vetOpt.get();
            
            // Update fields that are provided
            if (profileData.containsKey("experience")) {
                vet.setExperience((Integer) profileData.get("experience"));
            }
            if (profileData.containsKey("specializations")) {
                @SuppressWarnings("unchecked")
                java.util.List<String> specializations = (java.util.List<String>) profileData.get("specializations");
                vet.setSpecializations(specializations);
            }
            if (profileData.containsKey("otherSpecialization")) {
                vet.setOtherSpecialization((String) profileData.get("otherSpecialization"));
            }
            if (profileData.containsKey("qualifications")) {
                @SuppressWarnings("unchecked")
                java.util.List<String> qualifications = (java.util.List<String>) profileData.get("qualifications");
                vet.setQualifications(qualifications);
            }
            if (profileData.containsKey("otherQualification")) {
                vet.setOtherQualification((String) profileData.get("otherQualification"));
            }
            if (profileData.containsKey("offerHomeConsultation")) {
                vet.setOfferHomeConsultation((Boolean) profileData.get("offerHomeConsultation"));
            }
            if (profileData.containsKey("offerOnlineConsultation")) {
                vet.setOfferOnlineConsultation((Boolean) profileData.get("offerOnlineConsultation"));
            }
            if (profileData.containsKey("homeVisitRadius")) {
                vet.setHomeVisitRadius((Integer) profileData.get("homeVisitRadius"));
            }
            if (profileData.containsKey("availabilitySchedule")) {
                vet.setAvailabilitySchedule((String) profileData.get("availabilitySchedule"));
            }
            
            veterinarianRepository.save(vet);
            return getVeterinarianProfessionalProfile(user);
        }
        
        return new HashMap<>();
    }

    private Map<String, Object> updateTrainerProfile(User user, Map<String, Object> profileData) {
        Optional<Trainer> trainerOpt = trainerRepository.findByUserId(user.getId());
        if (trainerOpt.isPresent()) {
            Trainer trainer = trainerOpt.get();
            
            // Update fields that are provided
            if (profileData.containsKey("experience")) {
                trainer.setExperience((Integer) profileData.get("experience"));
            }
            if (profileData.containsKey("specializations")) {
                @SuppressWarnings("unchecked")
                java.util.List<String> specializations = (java.util.List<String>) profileData.get("specializations");
                trainer.setSpecializations(specializations);
            }
            if (profileData.containsKey("otherSpecialization")) {
                trainer.setOtherSpecialization((String) profileData.get("otherSpecialization"));
            }
            if (profileData.containsKey("certifications")) {
                @SuppressWarnings("unchecked")
                java.util.List<String> certifications = (java.util.List<String>) profileData.get("certifications");
                trainer.setCertifications(certifications);
            }
            if (profileData.containsKey("otherCertification")) {
                trainer.setOtherCertification((String) profileData.get("otherCertification"));
            }
            if (profileData.containsKey("offerHomeTraining")) {
                trainer.setOfferHomeTraining((Boolean) profileData.get("offerHomeTraining"));
            }
            if (profileData.containsKey("homeTrainingRadius")) {
                trainer.setHomeTrainingRadius((Integer) profileData.get("homeTrainingRadius"));
            }
            if (profileData.containsKey("availabilitySchedule")) {
                trainer.setAvailabilitySchedule((String) profileData.get("availabilitySchedule"));
            }
            
            trainerRepository.save(trainer);
            return getTrainerProfessionalProfile(user);
        }
        
        return new HashMap<>();
    }

    private Map<String, Object> updateHospitalProfile(User user, Map<String, Object> profileData) {
        Optional<Hospital> hospitalOpt = hospitalRepository.findByUserId(user.getId());
        if (hospitalOpt.isPresent()) {
            Hospital hospital = hospitalOpt.get();
            
            // Update fields that are provided
            if (profileData.containsKey("businessName")) {
                hospital.setBusinessName((String) profileData.get("businessName"));
            }
            if (profileData.containsKey("contactPerson")) {
                hospital.setContactPerson((String) profileData.get("contactPerson"));
            }
            if (profileData.containsKey("offerOnlineConsultation")) {
                hospital.setOfferOnlineConsultation((Boolean) profileData.get("offerOnlineConsultation"));
            }
            if (profileData.containsKey("offerClinicHospital")) {
                hospital.setOfferClinicHospital((Boolean) profileData.get("offerClinicHospital"));
            }
            if (profileData.containsKey("medicalDirectorName")) {
                hospital.setMedicalDirectorName((String) profileData.get("medicalDirectorName"));
            }
            if (profileData.containsKey("medicalDirectorLicenseNumber")) {
                hospital.setMedicalDirectorLicenseNumber((String) profileData.get("medicalDirectorLicenseNumber"));
            }
            
            hospitalRepository.save(hospital);
            return getHospitalProfessionalProfile(user);
        }
        
        return new HashMap<>();
    }

    public String uploadDocument(User user, MultipartFile file, String documentType) throws IOException {
        String fileUrl = null;
        
        try {
            switch (user.getUserType()) {
                case VETERINARIAN:
                    fileUrl = uploadVeterinarianDocument(user, file, documentType);
                    break;
                case TRAINER:
                    fileUrl = uploadTrainerDocument(user, file, documentType);
                    break;
                case HOSPITAL:
                case CLINIC:
                    fileUrl = uploadHospitalDocument(user, file, documentType);
                    break;
                default:
                    throw new IllegalArgumentException("Document upload not supported for this user type");
            }
        } catch (Exception e) {
            log.error("Error uploading document: {}", e.getMessage(), e);
            throw new IOException("Failed to upload document", e);
        }
        
        return fileUrl;
    }

    private String uploadVeterinarianDocument(User user, MultipartFile file, String documentType) throws IOException {
        Optional<Veterinarian> vetOpt = veterinarianRepository.findByUserId(user.getId());
        if (vetOpt.isPresent()) {
            Veterinarian vet = vetOpt.get();
            String fileUrl = fileStorageService.store("vet-documents", file);
            
            switch (documentType) {
                case "licenseProof":
                    vet.setLicenseProofUrl(fileUrl);
                    break;
                case "idProof":
                    vet.setIdProofUrl(fileUrl);
                    break;
                case "degreeProof":
                    vet.setDegreeProofUrl(fileUrl);
                    break;
                case "profilePhoto":
                    vet.setProfilePhotoUrl(fileUrl);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid document type for veterinarian");
            }
            
            veterinarianRepository.save(vet);
            return fileUrl;
        }
        
        throw new IllegalArgumentException("Veterinarian profile not found");
    }

    private String uploadTrainerDocument(User user, MultipartFile file, String documentType) throws IOException {
        Optional<Trainer> trainerOpt = trainerRepository.findByUserId(user.getId());
        if (trainerOpt.isPresent()) {
            Trainer trainer = trainerOpt.get();
            String fileUrl = fileStorageService.store("trainer-documents", file);
            
            switch (documentType) {
                case "resume":
                    trainer.setResumeUrl(fileUrl);
                    break;
                case "profilePhoto":
                    trainer.setProfilePhotoUrl(fileUrl);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid document type for trainer");
            }
            
            trainerRepository.save(trainer);
            return fileUrl;
        }
        
        throw new IllegalArgumentException("Trainer profile not found");
    }

    private String uploadHospitalDocument(User user, MultipartFile file, String documentType) throws IOException {
        Optional<Hospital> hospitalOpt = hospitalRepository.findByUserId(user.getId());
        if (hospitalOpt.isPresent()) {
            Hospital hospital = hospitalOpt.get();
            String fileUrl = fileStorageService.store("hospital-documents", file);
            
            switch (documentType) {
                case "facilityLicenseDocument":
                    hospital.setFacilityLicenseDocumentUrl(fileUrl);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid document type for hospital");
            }
            
            hospitalRepository.save(hospital);
            return fileUrl;
        }
        
        throw new IllegalArgumentException("Hospital profile not found");
    }

    public void deleteDocument(User user, String documentType) {
        switch (user.getUserType()) {
            case VETERINARIAN:
                deleteVeterinarianDocument(user, documentType);
                break;
            case TRAINER:
                deleteTrainerDocument(user, documentType);
                break;
            case HOSPITAL:
            case CLINIC:
                deleteHospitalDocument(user, documentType);
                break;
            default:
                throw new IllegalArgumentException("Document deletion not supported for this user type");
        }
    }

    private void deleteVeterinarianDocument(User user, String documentType) {
        Optional<Veterinarian> vetOpt = veterinarianRepository.findByUserId(user.getId());
        if (vetOpt.isPresent()) {
            Veterinarian vet = vetOpt.get();
            
            switch (documentType) {
                case "licenseProof":
                    vet.setLicenseProofUrl(null);
                    break;
                case "idProof":
                    vet.setIdProofUrl(null);
                    break;
                case "degreeProof":
                    vet.setDegreeProofUrl(null);
                    break;
                case "profilePhoto":
                    vet.setProfilePhotoUrl(null);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid document type for veterinarian");
            }
            
            veterinarianRepository.save(vet);
        }
    }

    private void deleteTrainerDocument(User user, String documentType) {
        Optional<Trainer> trainerOpt = trainerRepository.findByUserId(user.getId());
        if (trainerOpt.isPresent()) {
            Trainer trainer = trainerOpt.get();
            
            switch (documentType) {
                case "resume":
                    trainer.setResumeUrl(null);
                    break;
                case "profilePhoto":
                    trainer.setProfilePhotoUrl(null);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid document type for trainer");
            }
            
            trainerRepository.save(trainer);
        }
    }

    private void deleteHospitalDocument(User user, String documentType) {
        Optional<Hospital> hospitalOpt = hospitalRepository.findByUserId(user.getId());
        if (hospitalOpt.isPresent()) {
            Hospital hospital = hospitalOpt.get();
            
            switch (documentType) {
                case "facilityLicenseDocument":
                    hospital.setFacilityLicenseDocumentUrl(null);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid document type for hospital");
            }
            
            hospitalRepository.save(hospital);
        }
    }

    public Map<String, Object> getVerificationStatus(User user) {
        Map<String, Object> status = new HashMap<>();
        
        status.put("isVerified", user.getIsVerified());
        status.put("userType", user.getUserType().getValue());
        
        // Add specific verification requirements based on user type
        switch (user.getUserType()) {
            case VETERINARIAN:
                status.put("requirements", new String[]{
                    "License Proof",
                    "ID Proof", 
                    "Degree Proof",
                    "Profile Photo"
                });
                break;
            case TRAINER:
                status.put("requirements", new String[]{
                    "Resume",
                    "Profile Photo"
                });
                break;
            case HOSPITAL:
            case CLINIC:
                status.put("requirements", new String[]{
                    "Facility License Document"
                });
                break;
            default:
                status.put("requirements", new String[]{});
        }
        
        return status;
    }

    public void requestVerification(User user) {
        // TODO: Implement verification request logic
        // This could send notifications to admin users
        log.info("Verification requested for user: {}", user.getUsername());
    }
}
