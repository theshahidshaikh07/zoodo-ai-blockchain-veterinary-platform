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
@Table(name = "hospitals")
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "business_name", nullable = false, length = 255)
    @NotBlank
    @Size(max = 255)
    private String businessName;

    @Column(name = "contact_person", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String contactPerson;

    @Column(name = "account_type", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String accountType; // 'hospital' or 'clinic'

    // Business services
    @Column(name = "offer_online_consultation")
    private Boolean offerOnlineConsultation = false;

    @Column(name = "offer_clinic_hospital")
    private Boolean offerClinicHospital = true;

    // Business hours (JSON format for flexibility)
    @Column(name = "business_hours", columnDefinition = "jsonb")
    private String businessHours;

    // Compliance details
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

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Hospital() {}

    public Hospital(User user, String businessName, String contactPerson, String accountType) {
        this.user = user;
        this.businessName = businessName;
        this.contactPerson = contactPerson;
        this.accountType = accountType;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public Boolean getOfferOnlineConsultation() { return offerOnlineConsultation; }
    public void setOfferOnlineConsultation(Boolean offerOnlineConsultation) { this.offerOnlineConsultation = offerOnlineConsultation; }

    public Boolean getOfferClinicHospital() { return offerClinicHospital; }
    public void setOfferClinicHospital(Boolean offerClinicHospital) { this.offerClinicHospital = offerClinicHospital; }

    public String getBusinessHours() { return businessHours; }
    public void setBusinessHours(String businessHours) { this.businessHours = businessHours; }

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

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
