package com.zoodo.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @NotBlank(message = "Pet name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Species is required")
    @Column(nullable = false, length = 50)
    private String species;

    @Column(length = 100)
    private String breed;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column
    private Integer age;

    @Column(name = "age_unit", length = 10)
    private String ageUnit; // Years, Months, Days

    @Column(precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(name = "weight_unit", length = 10)
    private String weightUnit; // Kgs, Gms

    @Column(name = "microchip_id", length = 50)
    private String microchipId;

    @Column
    private Boolean sterilized;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "blockchain_record_hash", length = 255)
    private String blockchainRecordHash;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enum for Gender
    public enum Gender {
        MALE("male"),
        FEMALE("female"),
        UNKNOWN("unknown");

        private final String value;

        Gender(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static Gender fromValue(String value) {
            for (Gender gender : Gender.values()) {
                if (gender.value.equals(value)) {
                    return gender;
                }
            }
            throw new IllegalArgumentException("Unknown gender: " + value);
        }
    }
}
