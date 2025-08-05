package com.zoodo.backend.controller;

import com.zoodo.backend.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> healthData = new HashMap<>();
        healthData.put("status", "healthy");
        healthData.put("service", "Zoodo Backend");
        healthData.put("version", "1.0.0");
        healthData.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Service is healthy", healthData));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<String>> home() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Zoodo Backend API", "Welcome to Zoodo Backend API"));
    }
} 