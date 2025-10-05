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
@Table(name = "hospital_clinic_registrations")
public class HospitalClinicRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Step 1: Business Information (Required)
    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 20)
    private AccountType accountType;

    @Column(name = "business_name", nullable = false, length = 255)
    @NotBlank
    @Size(max = 255)
    private String businessName;

    // Step 2: Contact & Address (Required)
    @Column(name = "contact_person", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String contactPerson;

    @Column(unique = true, nullable = false, length = 255)
    @Email
    @NotBlank
    private String email;

    @Column(name = "phone_number", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String phoneNumber;

    @Column(nullable = false)
    @NotBlank
    private String address;

    @Column(nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String city;

    @Column(nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String state;

    @Column(nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String country;

    @Column(name = "postal_code", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String postalCode;

    // Step 3: Compliance & Services (Required)
    @Column(name = "facility_license_number", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String facilityLicenseNumber;

    @Column(name = "govt_registration_number", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String govtRegistrationNumber;

    @Column(name = "tax_id", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String taxId;

    @Column(name = "medical_director_name", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String medicalDirectorName;

    @Column(name = "medical_director_license_number", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String medicalDirectorLicenseNumber;

    @Column(name = "facility_license_document_url", length = 500)
    @Size(max = 500)
    private String facilityLicenseDocumentUrl;

    // Account credentials
    @Column(unique = true, nullable = false, length = 100)
    @Size(min = 3, max = 100)
    @NotBlank
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    @JsonIgnore
    @NotBlank
    private String passwordHash;

    // Business services
    @Column(name = "offer_online_consultation")
    private Boolean offerOnlineConsultation = false;

    @Column(name = "offer_clinic_hospital")
    private Boolean offerClinicHospital = true;

    // Business hours (JSON format for flexibility)
    @Column(name = "business_hours", columnDefinition = "jsonb")
    private String businessHours;

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
    public HospitalClinicRegistration() {}

    public HospitalClinicRegistration(AccountType accountType, String businessName, String contactPerson, String email, String phoneNumber, String address) {
        this.accountType = accountType;
        this.businessName = businessName;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public AccountType getAccountType() { return accountType; }
    public void setAccountType(AccountType accountType) { this.accountType = accountType; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getFacilityLicenseNumber() { return facilityLicenseNumber; }
    public void setFacilityLicenseNumber(String facilityLicenseNumber) { this.facilityLicenseNumber = facilityLicenseNumber; }

    public String getGovtRegistrationNumber() { return govtRegistrationNumber; }
    public void setGovtRegistrationNumber(String govtRegistrationNumber) { this.govtRegistrationNumber = govtRegistrationNumber; }

    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { this.taxId = taxId; }

    public String getMedicalDirectorName() { return medicalDirectorName; }
    public void setMedicalDirectorName(String medicalDirectorName) { this.medicalDirectorName = medicalDirectorName; }

    public String getMedicalDirectorLicenseNumber() { return medicalDirectorLicenseNumber; }
    public void setMedicalDirectorLicenseNumber(String medicalDirectorLicenseNumber) { this.medicalDirectorLicenseNumber = medicalDirectorLicenseNumber; }

    public String getFacilityLicenseDocumentUrl() { return facilityLicenseDocumentUrl; }
    public void setFacilityLicenseDocumentUrl(String facilityLicenseDocumentUrl) { this.facilityLicenseDocumentUrl = facilityLicenseDocumentUrl; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Boolean getOfferOnlineConsultation() { return offerOnlineConsultation; }
    public void setOfferOnlineConsultation(Boolean offerOnlineConsultation) { this.offerOnlineConsultation = offerOnlineConsultation; }

    public Boolean getOfferClinicHospital() { return offerClinicHospital; }
    public void setOfferClinicHospital(Boolean offerClinicHospital) { this.offerClinicHospital = offerClinicHospital; }

    public String getBusinessHours() { return businessHours; }
    public void setBusinessHours(String businessHours) { this.businessHours = businessHours; }

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

    // Enum for Account Type
    public enum AccountType {
        HOSPITAL("hospital"),
        CLINIC("clinic");

        private final String value;

        AccountType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static AccountType fromValue(String value) {
            for (AccountType type : AccountType.values()) {
                if (type.value.equals(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown account type: " + value);
        }
    }

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
