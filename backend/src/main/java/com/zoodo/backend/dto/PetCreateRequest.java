package com.zoodo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetCreateRequest {

    @NotBlank(message = "Pet name is required")
    private String name;

    @NotBlank(message = "Species is required")
    private String species;

    private String breed;

    @Positive(message = "Age must be positive")
    private Integer age;

    @Positive(message = "Weight must be positive")
    private Double weight;

    private String color;

    private String photoUrl;
} 