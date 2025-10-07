package com.zoodo.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "veterinarians")
public class Veterinarian {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "license_number", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String licenseNumber;

    @Column
    private Integer experience;

    @Column(name = "specializations", columnDefinition = "TEXT[]")
    private java.util.List<String> specializations;

    @Column(name = "other_specialization", length = 255)
    @Size(max = 255)
    private String otherSpecialization;

    @Column(name = "qualifications", columnDefinition = "TEXT[]")
    private java.util.List<String> qualifications;

    @Column(name = "other_qualification", length = 255)
    @Size(max = 255)
    private String otherQualification;

    @Column(name = "resume_url", length = 500)
    @Size(max = 500)
    private String resumeUrl;

    @Column(name = "profile_photo_url", length = 500)
    @Size(max = 500)
    private String profilePhotoUrl;

    @Column(name = "license_proof_url", length = 500)
    @Size(max = 500)
    private String licenseProofUrl;

    @Column(name = "id_proof_url", length = 500)
    @Size(max = 500)
    private String idProofUrl;

    @Column(name = "degree_proof_url", length = 500)
    @Size(max = 500)
    private String degreeProofUrl;

    @Column(name = "is_affiliated")
    private Boolean isAffiliated = false;

    @Column(name = "affiliated_facility_name", length = 255)
    @Size(max = 255)
    private String affiliatedFacilityName;

    @Column(name = "affiliation_type", length = 50)
    @Size(max = 50)
    private String affiliationType;

    @Column(name = "other_facility_name", length = 255)
    @Size(max = 255)
    private String otherFacilityName;

    // Independent services
    @Column(name = "offer_home_consultation")
    private Boolean offerHomeConsultation = false;

    @Column(name = "offer_online_consultation")
    private Boolean offerOnlineConsultation = false;

    @Column(name = "independent_service_address")
    private String independentServiceAddress;

    @Column(name = "independent_service_same_as_personal")
    private Boolean independentServiceSameAsPersonal = true;

    @Column(name = "independent_service_street", length = 255)
    @Size(max = 255)
    private String independentServiceStreet;

    @Column(name = "independent_service_city", length = 100)
    @Size(max = 100)
    private String independentServiceCity;

    @Column(name = "independent_service_zip", length = 20)
    @Size(max = 20)
    private String independentServiceZip;

    @Column(name = "home_visit_radius")
    private Integer homeVisitRadius; // in km


    @Column(name = "availability_schedule", columnDefinition = "JSONB")
    private String availabilitySchedule; // JSON string for flexibility

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Veterinarian() {}

    public Veterinarian(User user, String licenseNumber) {
        this.user = user;
        this.licenseNumber = licenseNumber;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }

    public java.util.List<String> getSpecializations() { return specializations; }
    public void setSpecializations(java.util.List<String> specializations) { this.specializations = specializations; }

    public String getOtherSpecialization() { return otherSpecialization; }
    public void setOtherSpecialization(String otherSpecialization) { this.otherSpecialization = otherSpecialization; }

    public java.util.List<String> getQualifications() { return qualifications; }
    public void setQualifications(java.util.List<String> qualifications) { this.qualifications = qualifications; }

    public String getOtherQualification() { return otherQualification; }
    public void setOtherQualification(String otherQualification) { this.otherQualification = otherQualification; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public String getLicenseProofUrl() { return licenseProofUrl; }
    public void setLicenseProofUrl(String licenseProofUrl) { this.licenseProofUrl = licenseProofUrl; }

    public String getIdProofUrl() { return idProofUrl; }
    public void setIdProofUrl(String idProofUrl) { this.idProofUrl = idProofUrl; }

    public String getDegreeProofUrl() { return degreeProofUrl; }
    public void setDegreeProofUrl(String degreeProofUrl) { this.degreeProofUrl = degreeProofUrl; }

    public Boolean getIsAffiliated() { return isAffiliated; }
    public void setIsAffiliated(Boolean isAffiliated) { this.isAffiliated = isAffiliated; }

    public String getAffiliatedFacilityName() { return affiliatedFacilityName; }
    public void setAffiliatedFacilityName(String affiliatedFacilityName) { this.affiliatedFacilityName = affiliatedFacilityName; }

    public String getAffiliationType() { return affiliationType; }
    public void setAffiliationType(String affiliationType) { this.affiliationType = affiliationType; }

    public String getOtherFacilityName() { return otherFacilityName; }
    public void setOtherFacilityName(String otherFacilityName) { this.otherFacilityName = otherFacilityName; }

    public Boolean getOfferHomeConsultation() { return offerHomeConsultation; }
    public void setOfferHomeConsultation(Boolean offerHomeConsultation) { this.offerHomeConsultation = offerHomeConsultation; }

    public Boolean getOfferOnlineConsultation() { return offerOnlineConsultation; }
    public void setOfferOnlineConsultation(Boolean offerOnlineConsultation) { this.offerOnlineConsultation = offerOnlineConsultation; }

    public String getIndependentServiceAddress() { return independentServiceAddress; }
    public void setIndependentServiceAddress(String independentServiceAddress) { this.independentServiceAddress = independentServiceAddress; }

    public Boolean getIndependentServiceSameAsPersonal() { return independentServiceSameAsPersonal; }
    public void setIndependentServiceSameAsPersonal(Boolean independentServiceSameAsPersonal) { this.independentServiceSameAsPersonal = independentServiceSameAsPersonal; }

    public String getIndependentServiceStreet() { return independentServiceStreet; }
    public void setIndependentServiceStreet(String independentServiceStreet) { this.independentServiceStreet = independentServiceStreet; }

    public String getIndependentServiceCity() { return independentServiceCity; }
    public void setIndependentServiceCity(String independentServiceCity) { this.independentServiceCity = independentServiceCity; }

    public String getIndependentServiceZip() { return independentServiceZip; }
    public void setIndependentServiceZip(String independentServiceZip) { this.independentServiceZip = independentServiceZip; }

    public Integer getHomeVisitRadius() { return homeVisitRadius; }
    public void setHomeVisitRadius(Integer homeVisitRadius) { this.homeVisitRadius = homeVisitRadius; }

    public String getAvailabilitySchedule() { return availabilitySchedule; }
    public void setAvailabilitySchedule(String availabilitySchedule) { this.availabilitySchedule = availabilitySchedule; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
