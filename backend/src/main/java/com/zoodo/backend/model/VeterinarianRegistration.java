package com.zoodo.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "veterinarian_registrations")
public class VeterinarianRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Step 1: Personal Information (Required)
    @Column(unique = true, nullable = false, length = 100)
    @Size(min = 3, max = 100)
    @NotBlank
    private String username;

    @Column(name = "first_name", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String lastName;

    @Column(unique = true, nullable = false, length = 255)
    @Email
    @NotBlank
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    @JsonIgnore
    @NotBlank
    private String passwordHash;

    @Column(name = "phone_number", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String phoneNumber;

    @Column(nullable = false)
    @NotBlank
    private String address;

    // Step 2: Professional Details (Required)
    @Column(name = "license_number", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String licenseNumber;

    @Column(nullable = false)
    private Integer experience;

    @jakarta.persistence.ElementCollection
    @jakarta.persistence.CollectionTable(name = "vet_reg_specializations", 
                                       joinColumns = @JoinColumn(name = "veterinarian_registration_id"))
    @Column(name = "specialization")
    private java.util.List<String> specializations;

    @Column(name = "other_specialization", length = 255)
    @Size(max = 255)
    private String otherSpecialization;

    @jakarta.persistence.ElementCollection
    @jakarta.persistence.CollectionTable(name = "vet_reg_qualifications",
                                       joinColumns = @JoinColumn(name = "veterinarian_registration_id"))
    @Column(name = "qualification")
    private java.util.List<String> qualifications;

    @Column(name = "other_qualification", length = 255)
    @Size(max = 255)
    private String otherQualification;

    @Column(name = "is_affiliated")
    private Boolean isAffiliated = false;

    // Affiliation details (if affiliated)
    @Column(name = "affiliated_facility_name", length = 255)
    @Size(max = 255)
    private String affiliatedFacilityName;

    @Column(name = "affiliated_type", length = 50)
    @Size(max = 50)
    private String affiliatedType;

    @Column(name = "other_facility_name", length = 255)
    @Size(max = 255)
    private String otherFacilityName;

    // Step 3: Document Uploads (Required)
    @Column(name = "license_proof_url", length = 500)
    @Size(max = 500)
    private String licenseProofUrl;

    @Column(name = "id_proof_url", length = 500)
    @Size(max = 500)
    private String idProofUrl;

    @Column(name = "degree_proof_url", length = 500)
    @Size(max = 500)
    private String degreeProofUrl;

    @Column(name = "profile_photo_url", length = 500)
    @Size(max = 500)
    private String profilePhotoUrl;

    // Step 4: Service Details (Required)
    @Column(name = "offer_online_consultation")
    private Boolean offerOnlineConsultation = false;

    @Column(name = "offer_home_consultation")
    private Boolean offerHomeConsultation = false;

    // Home service address details
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

    // Step 5: Availability Schedule (JSON format for flexibility)
    @Column(name = "availability_schedule", columnDefinition = "jsonb")
    private String availabilitySchedule;

    // Registration metadata
    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status", length = 20)
    private RegistrationStatus registrationStatus = RegistrationStatus.PENDING;

    @Column(name = "verification_notes")
    private String verificationNotes;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Link to main users table when registration is completed
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // Constructors
    public VeterinarianRegistration() {}

    public VeterinarianRegistration(String username, String firstName, String lastName, String email, String passwordHash, String phoneNumber, String address) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

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

    public Boolean getIsAffiliated() { return isAffiliated; }
    public void setIsAffiliated(Boolean isAffiliated) { this.isAffiliated = isAffiliated; }

    public String getAffiliatedFacilityName() { return affiliatedFacilityName; }
    public void setAffiliatedFacilityName(String affiliatedFacilityName) { this.affiliatedFacilityName = affiliatedFacilityName; }

    public String getAffiliatedType() { return affiliatedType; }
    public void setAffiliatedType(String affiliatedType) { this.affiliatedType = affiliatedType; }

    public String getOtherFacilityName() { return otherFacilityName; }
    public void setOtherFacilityName(String otherFacilityName) { this.otherFacilityName = otherFacilityName; }

    public String getLicenseProofUrl() { return licenseProofUrl; }
    public void setLicenseProofUrl(String licenseProofUrl) { this.licenseProofUrl = licenseProofUrl; }

    public String getIdProofUrl() { return idProofUrl; }
    public void setIdProofUrl(String idProofUrl) { this.idProofUrl = idProofUrl; }

    public String getDegreeProofUrl() { return degreeProofUrl; }
    public void setDegreeProofUrl(String degreeProofUrl) { this.degreeProofUrl = degreeProofUrl; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public Boolean getOfferOnlineConsultation() { return offerOnlineConsultation; }
    public void setOfferOnlineConsultation(Boolean offerOnlineConsultation) { this.offerOnlineConsultation = offerOnlineConsultation; }

    public Boolean getOfferHomeConsultation() { return offerHomeConsultation; }
    public void setOfferHomeConsultation(Boolean offerHomeConsultation) { this.offerHomeConsultation = offerHomeConsultation; }

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

    public String getAvailabilitySchedule() { return availabilitySchedule; }
    public void setAvailabilitySchedule(String availabilitySchedule) { this.availabilitySchedule = availabilitySchedule; }

    public RegistrationStatus getRegistrationStatus() { return registrationStatus; }
    public void setRegistrationStatus(RegistrationStatus registrationStatus) { this.registrationStatus = registrationStatus; }

    public String getVerificationNotes() { return verificationNotes; }
    public void setVerificationNotes(String verificationNotes) { this.verificationNotes = verificationNotes; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    // Enum for Registration Status
    public enum RegistrationStatus {
        PENDING("pending"),
        UNDER_REVIEW("under_review"),
        APPROVED("approved"),
        REJECTED("rejected");

        private final String value;

        RegistrationStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static RegistrationStatus fromValue(String value) {
            for (RegistrationStatus status : RegistrationStatus.values()) {
                if (status.value.equals(value)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Unknown registration status: " + value);
        }
    }
}
