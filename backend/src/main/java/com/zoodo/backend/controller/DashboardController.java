package com.zoodo.backend.controller;

import com.zoodo.backend.dto.ApiResponse;
import com.zoodo.backend.model.User;
import com.zoodo.backend.service.AuthService;
import com.zoodo.backend.service.DashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// Temporarily disabled due to memory issues
// @RestController
// @RequestMapping("/api/dashboard")
// @Slf4j
// @CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private AuthService authService;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardOverview() {
        try {
            // Create a mock user for demonstration purposes
            // In a real scenario, you might want to pass user info as a parameter
            User mockUser = new User();
            mockUser.setId(java.util.UUID.randomUUID());
            mockUser.setUserType(User.UserType.PET_OWNER);
            mockUser.setUsername("demo_user");
            mockUser.setIsVerified(true);
            
            Map<String, Object> overview = dashboardService.getDashboardOverview(mockUser);
            
            return ResponseEntity.ok(ApiResponse.success(overview));
        } catch (Exception e) {
            log.error("Error getting dashboard overview: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get dashboard overview"));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            // Create a mock user for demonstration purposes
            User mockUser = new User();
            mockUser.setId(java.util.UUID.randomUUID());
            mockUser.setUserType(User.UserType.PET_OWNER);
            mockUser.setUsername("demo_user");
            mockUser.setIsVerified(true);
            
            Map<String, Object> stats = dashboardService.getDashboardStats(mockUser);
            
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("Error getting dashboard stats: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get dashboard stats"));
        }
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRecentActivity() {
        try {
            // Create a mock user for demonstration purposes
            User mockUser = new User();
            mockUser.setId(java.util.UUID.randomUUID());
            mockUser.setUserType(User.UserType.PET_OWNER);
            mockUser.setUsername("demo_user");
            mockUser.setIsVerified(true);
            
            Map<String, Object> activity = dashboardService.getRecentActivity(mockUser);
            
            return ResponseEntity.ok(ApiResponse.success(activity));
        } catch (Exception e) {
            log.error("Error getting recent activity: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get recent activity"));
        }
    }
}
