package com.zoodo.backend.controller;

import com.zoodo.backend.dto.*;
import com.zoodo.backend.model.User;
import com.zoodo.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Slf4j
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> adminLogin(
            @Valid @RequestBody AdminLoginRequest request) {
        try {
            log.info("Admin login attempt for: {}", request.getUsernameOrEmail());
            
            String token = adminService.adminLogin(request);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "token", token,
                    "message", "Admin login successful"
                )
            ));
        } catch (Exception e) {
            log.error("Admin login failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Admin login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserSummaryDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        try {
            log.info("Fetching users - page: {}, size: {}, userType: {}, search: {}, status: {}", 
                    page, size, userType, search, status);
            
            Page<UserSummaryDto> users = adminService.getAllUsers(page, size, userType, search, status);
            
            return ResponseEntity.ok(ApiResponse.success(users));
        } catch (Exception e) {
            log.error("Error fetching users: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to fetch users: " + e.getMessage()));
        }
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDetailDto>> getUserDetails(@PathVariable String userId) {
        try {
            log.info("Fetching user details for ID: {}", userId);
            
            UserDetailDto userDetails = adminService.getUserDetails(userId);
            
            return ResponseEntity.ok(ApiResponse.success(userDetails));
        } catch (Exception e) {
            log.error("Error fetching user details: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("User not found: " + e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateUserStatus(
            @PathVariable String userId,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        try {
            log.info("Updating user status for ID: {} to {}", userId, request.getStatus());
            
            adminService.updateUserStatus(userId, request.getStatus());
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "userId", userId,
                    "status", request.getStatus(),
                    "message", "User status updated successfully"
                )
            ));
        } catch (Exception e) {
            log.error("Error updating user status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Failed to update user status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteUser(@PathVariable String userId) {
        try {
            log.info("Deleting user with ID: {}", userId);
            
            adminService.deleteUser(userId);
            
            return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                    "userId", userId,
                    "message", "User deleted successfully"
                )
            ));
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Failed to delete user: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemStats() {
        try {
            log.info("Fetching system statistics");
            
            Map<String, Object> stats = adminService.getSystemStats();
            
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("Error fetching system stats: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to fetch system statistics: " + e.getMessage()));
        }
    }

    @GetMapping("/users/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserSummaryDto>>> exportUsers(
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) String status) {
        try {
            log.info("Exporting users - userType: {}, status: {}", userType, status);
            
            List<UserSummaryDto> users = adminService.exportUsers(userType, status);
            
            return ResponseEntity.ok(ApiResponse.success(users));
        } catch (Exception e) {
            log.error("Error exporting users: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to export users: " + e.getMessage()));
        }
    }
}
