package com.zoodo.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentCreateRequest {

    @NotNull(message = "Pet ID is required")
    private UUID petId;

    @NotNull(message = "Provider ID is required")
    private UUID providerId;

    @NotNull(message = "Appointment date is required")
    private LocalDateTime appointmentDate;

    @NotNull(message = "Appointment type is required")
    private String appointmentType;

    private String notes;
} 