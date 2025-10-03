package com.zoodo.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vet_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VetProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "specializations")
    private String specializations; // comma-separated

    @Column(name = "qualifications")
    private String qualifications; // comma-separated

    @Column(name = "license_proof_path")
    private String licenseProofPath;

    @Column(name = "id_proof_path")
    private String idProofPath;

    @Column(name = "degree_proof_path")
    private String degreeProofPath;

    @Column(name = "profile_photo_path")
    private String profilePhotoPath;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}


