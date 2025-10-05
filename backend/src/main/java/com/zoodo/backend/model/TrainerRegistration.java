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
@Table(name = "trainer_registrations")
public class TrainerRegistration {
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
    @Column(nullable = false)
    private Integer experience;

    @jakarta.persistence.ElementCollection
    @jakarta.persistence.CollectionTable(name = "trainer_reg_specializations",
                                       joinColumns = @JoinColumn(name = "trainer_registration_id"))
    @Column(name = "specialization")
    private java.util.List<String> specializations;

    @Column(name = "other_specialization", length = 255)
    @Size(max = 255)
    private String otherSpecialization;

    @jakarta.persistence.ElementCollection
    @jakarta.persistence.CollectionTable(name = "trainer_reg_certifications",
                                       joinColumns = @JoinColumn(name = "trainer_registration_id"))
    @Column(name = "certification")
    private java.util.List<String> certifications;

    @Column(name = "other_certification", length = 255)
    @Size(max = 255)
    private String otherCertification;

    // Document uploads
    @Column(name = "resume_url", length = 500)
    @Size(max = 500)
    private String resumeUrl;

    @Column(name = "profile_photo_url", length = 500)
    @Size(max = 500)
    private String profilePhotoUrl;

    // Step 3: Services (Required)
    @Column(name = "offer_online_training")
    private Boolean offerOnlineTraining = false;

    // Academy details (if has academy)
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

    // Step 4: Availability Schedule (JSON format for flexibility)
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
    public TrainerRegistration() {}

    public TrainerRegistration(String username, String firstName, String lastName, String email, String passwordHash, String phoneNumber, String address) {
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

    public Boolean getOfferOnlineTraining() { return offerOnlineTraining; }
    public void setOfferOnlineTraining(Boolean offerOnlineTraining) { this.offerOnlineTraining = offerOnlineTraining; }

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
