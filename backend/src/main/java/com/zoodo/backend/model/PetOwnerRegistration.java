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
@Table(name = "pet_owner_registrations")
public class PetOwnerRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Step 1: Basic Information (Required)
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

    // Step 2: Address Information (Optional)
    @Column(name = "address_line1", length = 255)
    @Size(max = 255)
    private String addressLine1;

    @Column(name = "address_line2", length = 255)
    @Size(max = 255)
    private String addressLine2;

    @Column(length = 100)
    @Size(max = 100)
    private String city;

    @Column(length = 100)
    @Size(max = 100)
    private String state;

    @Column(name = "postal_code", length = 20)
    @Size(max = 20)
    private String postalCode;

    @Column(length = 100)
    @Size(max = 100)
    private String country = "India";

    // Step 3: Pet Information (Optional - stored as JSONB)
    @Column(name = "pets_data", columnDefinition = "jsonb")
    private String petsData = "[]";

    // Registration metadata
    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status", length = 20)
    private RegistrationStatus registrationStatus = RegistrationStatus.PENDING;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Verification notes for admin review
    @Column(name = "verification_notes", length = 1000)
    @Size(max = 1000)
    private String verificationNotes;

    // Link to main users table when registration is completed
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // Constructors
    public PetOwnerRegistration() {}

    public PetOwnerRegistration(String username, String firstName, String lastName, String email, String passwordHash) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = passwordHash;
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

    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPetsData() { return petsData; }
    public void setPetsData(String petsData) { this.petsData = petsData; }

    public RegistrationStatus getRegistrationStatus() { return registrationStatus; }
    public void setRegistrationStatus(RegistrationStatus registrationStatus) { this.registrationStatus = registrationStatus; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getVerificationNotes() { return verificationNotes; }
    public void setVerificationNotes(String verificationNotes) { this.verificationNotes = verificationNotes; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    // Enum for Registration Status
    public enum RegistrationStatus {
        PENDING("pending"),
        APPROVED("approved"),
        COMPLETED("completed"),
        VERIFIED("verified"),
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
