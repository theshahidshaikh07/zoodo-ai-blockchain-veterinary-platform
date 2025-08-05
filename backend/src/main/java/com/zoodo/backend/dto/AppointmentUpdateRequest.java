package com.zoodo.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentUpdateRequest {

    private LocalDateTime appointmentDate;

    private String appointmentType;

    private String notes;

    private String status;
} 