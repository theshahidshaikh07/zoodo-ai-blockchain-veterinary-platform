package com.zoodo.backend.service;

import com.zoodo.backend.model.User;
import com.zoodo.backend.repository.UserRepository;
import com.zoodo.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@Service
public class GoogleOAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public String processOAuth2User(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        // Check if user already exists
        User existingUser = userRepository.findByEmail(email)
            .orElse(null);

        if (existingUser != null) {
            // User exists, generate JWT token for login
            return jwtUtil.generateToken(existingUser.getId(), existingUser.getEmail(), existingUser.getUserType().name());
        } else {
            // User doesn't exist - this is expected for registration flow
            // Return null to indicate user needs to register
            return null;
        }
    }

    public Map<String, Object> getOAuthUserInfo(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");
        String firstName = name != null ? name.split(" ")[0] : "Google";
        String lastName = name != null && name.split(" ").length > 1 ? name.split(" ")[1] : "User";

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("email", email);
        userInfo.put("firstName", firstName);
        userInfo.put("lastName", lastName);
        userInfo.put("picture", picture);
        
        return userInfo;
    }
}
