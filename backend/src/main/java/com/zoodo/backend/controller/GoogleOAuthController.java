package com.zoodo.backend.controller;

import com.zoodo.backend.dto.ApiResponse;
import com.zoodo.backend.service.GoogleOAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/oauth")
@CrossOrigin(origins = "*")
public class GoogleOAuthController {

    @Autowired
    private GoogleOAuthService googleOAuthService;

    @GetMapping("/google/success")
    public ResponseEntity<ApiResponse<Map<String, Object>>> googleOAuthSuccess(
            @AuthenticationPrincipal OAuth2User oauth2User) {
        try {
            System.out.println("OAuth2 Success endpoint called");
            System.out.println("OAuth2User: " + (oauth2User != null ? oauth2User.getName() : "null"));
            
            if (oauth2User == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("OAuth2User is null"));
            }
            
            String token = googleOAuthService.processOAuth2User(oauth2User);
            
            if (token != null) {
                // User exists, return token for login
                return ResponseEntity.ok(ApiResponse.success(
                    Map.of(
                        "token", token,
                        "message", "Google OAuth login successful",
                        "action", "login"
                    )
                ));
            } else {
                // User doesn't exist, return user info for registration
                System.out.println("User not found, returning registration info");
                Map<String, Object> userInfo = googleOAuthService.getOAuthUserInfo(oauth2User);
                userInfo.put("action", "register");
                userInfo.put("message", "User not found. Please complete registration.");
                
                return ResponseEntity.ok(ApiResponse.success(userInfo));
            }
        } catch (Exception e) {
            System.out.println("OAuth2 error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Google OAuth failed: " + e.getMessage()));
        }
    }

    @GetMapping("/google/failure")
    public ResponseEntity<ApiResponse<String>> googleOAuthFailure() {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("Google OAuth login failed"));
    }
}
