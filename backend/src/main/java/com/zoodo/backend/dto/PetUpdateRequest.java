package com.zoodo.backend.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetUpdateRequest {

    private String name;

    private String species;

    private String breed;

    @Positive(message = "Age must be positive")
    private Integer age;

    @Positive(message = "Weight must be positive")
    private Double weight;

    private String color;

    private String photoUrl;
} 