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

    @jakarta.persistence.ElementCollection
    @jakarta.persistence.CollectionTable(name = "veterinarian_specializations", 
                                       joinColumns = @JoinColumn(name = "veterinarian_id"))
    @Column(name = "specialization")
    private java.util.List<String> specializations;

    @jakarta.persistence.ElementCollection
    @jakarta.persistence.CollectionTable(name = "veterinarian_qualifications",
                                       joinColumns = @JoinColumn(name = "veterinarian_id"))
    @Column(name = "qualification")
    private java.util.List<String> qualifications;

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

    @Column(name = "affiliated_type", length = 50)
    @Size(max = 50)
    private String affiliatedType;

    @Column(name = "other_facility_name", length = 255)
    @Size(max = 255)
    private String otherFacilityName;

    // Service details
    @Column(name = "offer_online_consultation")
    private Boolean offerOnlineConsultation = false;

    @Column(name = "offer_home_visits")
    private Boolean offerHomeVisits = false;

    @Column(name = "home_service_address")
    private String homeServiceAddress;

    @Column(name = "home_service_same_as_personal")
    private Boolean homeServiceSameAsPersonal = true;

    @Column(name = "home_service_street", length = 255)
    @Size(max = 255)
    private String homeServiceStreet;

    @Column(name = "home_service_city", length = 100)
    @Size(max = 100)
    private String homeServiceCity;

    @Column(name = "home_service_zip", length = 20)
    @Size(max = 20)
    private String homeServiceZip;

    @Column(name = "home_visit_radius")
    private Integer homeVisitRadius; // in km

    @Column(name = "availability_settings", columnDefinition = "jsonb")
    private String availabilitySettings; // JSON string for flexibility

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

    public java.util.List<String> getQualifications() { return qualifications; }
    public void setQualifications(java.util.List<String> qualifications) { this.qualifications = qualifications; }

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

    public String getAffiliatedType() { return affiliatedType; }
    public void setAffiliatedType(String affiliatedType) { this.affiliatedType = affiliatedType; }

    public String getOtherFacilityName() { return otherFacilityName; }
    public void setOtherFacilityName(String otherFacilityName) { this.otherFacilityName = otherFacilityName; }

    public Boolean getOfferOnlineConsultation() { return offerOnlineConsultation; }
    public void setOfferOnlineConsultation(Boolean offerOnlineConsultation) { this.offerOnlineConsultation = offerOnlineConsultation; }

    public Boolean getOfferHomeVisits() { return offerHomeVisits; }
    public void setOfferHomeVisits(Boolean offerHomeVisits) { this.offerHomeVisits = offerHomeVisits; }

    public String getHomeServiceAddress() { return homeServiceAddress; }
    public void setHomeServiceAddress(String homeServiceAddress) { this.homeServiceAddress = homeServiceAddress; }

    public Boolean getHomeServiceSameAsPersonal() { return homeServiceSameAsPersonal; }
    public void setHomeServiceSameAsPersonal(Boolean homeServiceSameAsPersonal) { this.homeServiceSameAsPersonal = homeServiceSameAsPersonal; }

    public String getHomeServiceStreet() { return homeServiceStreet; }
    public void setHomeServiceStreet(String homeServiceStreet) { this.homeServiceStreet = homeServiceStreet; }

    public String getHomeServiceCity() { return homeServiceCity; }
    public void setHomeServiceCity(String homeServiceCity) { this.homeServiceCity = homeServiceCity; }

    public String getHomeServiceZip() { return homeServiceZip; }
    public void setHomeServiceZip(String homeServiceZip) { this.homeServiceZip = homeServiceZip; }

    public Integer getHomeVisitRadius() { return homeVisitRadius; }
    public void setHomeVisitRadius(Integer homeVisitRadius) { this.homeVisitRadius = homeVisitRadius; }

    public String getAvailabilitySettings() { return availabilitySettings; }
    public void setAvailabilitySettings(String availabilitySettings) { this.availabilitySettings = availabilitySettings; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
