package com.zoodo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateUserStatusRequest {
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(active|inactive|suspended)$", message = "Status must be active, inactive, or suspended")
    private String status;
    
    private String reason; // Optional reason for status change
}
