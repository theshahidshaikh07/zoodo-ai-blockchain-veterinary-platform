package com.zoodo.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "trainers")
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column
    private Integer experience;

    @Column(name = "specializations", columnDefinition = "TEXT[]")
    private java.util.List<String> specializations;

    @Column(name = "other_specialization", length = 255)
    @Size(max = 255)
    private String otherSpecialization;

    @Column(name = "certifications", columnDefinition = "TEXT[]")
    private java.util.List<String> certifications;

    @Column(name = "other_certification", length = 255)
    @Size(max = 255)
    private String otherCertification;

    @Column(name = "resume_url", length = 500)
    @Size(max = 500)
    private String resumeUrl;

    @Column(name = "profile_photo_url", length = 500)
    @Size(max = 500)
    private String profilePhotoUrl;

    @Column(name = "practice_type", columnDefinition = "JSONB")
    private String practiceType; // JSON string: {independent: boolean, trainingCenter: boolean, affiliated: boolean}

    // Service details
    @Column(name = "offer_home_training")
    private Boolean offerHomeTraining = false;

    // Independent practice details
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

    @Column(name = "home_training_radius")
    private Integer homeTrainingRadius; // in km

    // Training center details
    @Column(name = "has_training_center")
    private Boolean hasTrainingCenter = false;

    @Column(name = "training_center_name", length = 255)
    @Size(max = 255)
    private String trainingCenterName;

    @Column(name = "training_center_address")
    private String trainingCenterAddress;

    @Column(name = "training_center_offer_in_person")
    private Boolean trainingCenterOfferInPerson = false;

    // Affiliated details
    @Column(name = "affiliated_facility_name", length = 255)
    @Size(max = 255)
    private String affiliatedFacilityName;

    @Column(name = "affiliation_type", length = 50)
    @Size(max = 50)
    private String affiliationType;

    // Academy details
    @Column(name = "has_academy")
    private Boolean hasAcademy = false;

    @Column(name = "academy_name", length = 255)
    @Size(max = 255)
    private String academyName;

    @Column(name = "academy_street", length = 255)
    @Size(max = 255)
    private String academyStreet;

    @Column(name = "academy_city", length = 100)
    @Size(max = 100)
    private String academyCity;

    @Column(name = "academy_state", length = 100)
    @Size(max = 100)
    private String academyState;

    @Column(name = "academy_postal_code", length = 20)
    @Size(max = 20)
    private String academyPostalCode;

    @Column(name = "academy_country", length = 100)
    @Size(max = 100)
    private String academyCountry;

    @Column(name = "academy_phone", length = 20)
    @Size(max = 20)
    private String academyPhone;

    @Column(name = "availability_schedule", columnDefinition = "JSONB")
    private String availabilitySchedule; // JSON string for flexibility

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Trainer() {}

    public Trainer(User user) {
        this.user = user;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }

    public java.util.List<String> getSpecializations() { return specializations; }
    public void setSpecializations(java.util.List<String> specializations) { this.specializations = specializations; }

    public String getOtherSpecialization() { return otherSpecialization; }
    public void setOtherSpecialization(String otherSpecialization) { this.otherSpecialization = otherSpecialization; }

    public java.util.List<String> getCertifications() { return certifications; }
    public void setCertifications(java.util.List<String> certifications) { this.certifications = certifications; }

    public String getOtherCertification() { return otherCertification; }
    public void setOtherCertification(String otherCertification) { this.otherCertification = otherCertification; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public String getPracticeType() { return practiceType; }
    public void setPracticeType(String practiceType) { this.practiceType = practiceType; }


    public Boolean getOfferHomeTraining() { return offerHomeTraining; }
    public void setOfferHomeTraining(Boolean offerHomeTraining) { this.offerHomeTraining = offerHomeTraining; }


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

    public Integer getHomeTrainingRadius() { return homeTrainingRadius; }
    public void setHomeTrainingRadius(Integer homeTrainingRadius) { this.homeTrainingRadius = homeTrainingRadius; }

    public Boolean getHasTrainingCenter() { return hasTrainingCenter; }
    public void setHasTrainingCenter(Boolean hasTrainingCenter) { this.hasTrainingCenter = hasTrainingCenter; }

    public String getTrainingCenterName() { return trainingCenterName; }
    public void setTrainingCenterName(String trainingCenterName) { this.trainingCenterName = trainingCenterName; }

    public String getTrainingCenterAddress() { return trainingCenterAddress; }
    public void setTrainingCenterAddress(String trainingCenterAddress) { this.trainingCenterAddress = trainingCenterAddress; }

    public Boolean getTrainingCenterOfferInPerson() { return trainingCenterOfferInPerson; }
    public void setTrainingCenterOfferInPerson(Boolean trainingCenterOfferInPerson) { this.trainingCenterOfferInPerson = trainingCenterOfferInPerson; }



    public String getAffiliatedFacilityName() { return affiliatedFacilityName; }
    public void setAffiliatedFacilityName(String affiliatedFacilityName) { this.affiliatedFacilityName = affiliatedFacilityName; }

    public String getAffiliationType() { return affiliationType; }
    public void setAffiliationType(String affiliationType) { this.affiliationType = affiliationType; }

    public Boolean getHasAcademy() { return hasAcademy; }
    public void setHasAcademy(Boolean hasAcademy) { this.hasAcademy = hasAcademy; }

    public String getAcademyName() { return academyName; }
    public void setAcademyName(String academyName) { this.academyName = academyName; }

    public String getAcademyStreet() { return academyStreet; }
    public void setAcademyStreet(String academyStreet) { this.academyStreet = academyStreet; }

    public String getAcademyCity() { return academyCity; }
    public void setAcademyCity(String academyCity) { this.academyCity = academyCity; }

    public String getAcademyState() { return academyState; }
    public void setAcademyState(String academyState) { this.academyState = academyState; }

    public String getAcademyPostalCode() { return academyPostalCode; }
    public void setAcademyPostalCode(String academyPostalCode) { this.academyPostalCode = academyPostalCode; }

    public String getAcademyCountry() { return academyCountry; }
    public void setAcademyCountry(String academyCountry) { this.academyCountry = academyCountry; }

    public String getAcademyPhone() { return academyPhone; }
    public void setAcademyPhone(String academyPhone) { this.academyPhone = academyPhone; }

    public String getAvailabilitySchedule() { return availabilitySchedule; }
    public void setAvailabilitySchedule(String availabilitySchedule) { this.availabilitySchedule = availabilitySchedule; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
