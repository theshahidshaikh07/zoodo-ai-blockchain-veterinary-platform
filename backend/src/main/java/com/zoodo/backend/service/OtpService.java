package com.zoodo.backend.service;

import com.zoodo.backend.model.OtpCode;
import com.zoodo.backend.model.User;
import com.zoodo.backend.repository.OtpCodeRepository;
import com.zoodo.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class OtpService {

    @Autowired
    private OtpCodeRepository otpCodeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    private final SecureRandom random = new SecureRandom();

    /**
     * Generates a 6-digit OTP, hashes it, saves it to database, and sends/logs it.
     */
    public void generateAndSendOtp(User user, OtpCode.OtpPurpose purpose, String target) {
        // Generate random 6-digit code (e.g. 100000 to 999999)
        String code = String.valueOf(100000 + random.nextInt(900000));

        // Save hashed OTP to database
        OtpCode otpCode = new OtpCode();
        otpCode.setUser(user);
        otpCode.setPurpose(purpose);
        otpCode.setTarget(target);
        otpCode.setCodeHash(passwordEncoder.encode(code));
        otpCode.setAttempts(0);
        otpCode.setMaxAttempts(5);
        otpCode.setExpiresAt(LocalDateTime.now().plusMinutes(10)); // 10 minutes expiry
        otpCodeRepository.save(otpCode);

        // Send Email OTP
        sendEmailOtp(target, code, user.getFirstName());
    }

    private void sendEmailOtp(String email, String code, String firstName) {
        String subject = "Verify your Zoodo Account — OTP Code";
        String body = String.format(
            "Hello %s,\n\n" +
            "Your Zoodo verification code is: %s\n\n" +
            "This code is valid for 10 minutes. Please enter it on the website to verify your registration.\n\n" +
            "If you did not make this request, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The Zoodo Team",
            firstName, code
        );

        // Fallback if JavaMailSender is not initialized or fails due to missing SMTP config
        if (mailSender == null) {
            log.info("\n==================================================\n" +
                     "  [MAIL MOCK LOGGER] TO: {}\n" +
                     "  SUBJECT: {}\n" +
                     "  VERIFICATION CODE: {}\n" +
                     "==================================================\n", email, subject, code);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("OTP verification email sent successfully to {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}. Fallback to log print.", email, e);
            log.info("\n==================================================\n" +
                     "  [MAIL MOCK LOGGER] TO: {}\n" +
                     "  SUBJECT: {}\n" +
                     "  VERIFICATION CODE: {}\n" +
                     "==================================================\n", email, subject, code);
        }
    }

    /**
     * Verifies the provided code against active OTP records in DB.
     */
    public boolean verifyOtp(User user, OtpCode.OtpPurpose purpose, String code) {
        List<OtpCode> activeCodes = otpCodeRepository.findByUserAndPurposeAndUsedAtIsNullOrderByCreatedAtDesc(user, purpose);
        if (activeCodes.isEmpty()) {
            log.warn("No active OTP codes found for user {}", user.getUsername());
            return false;
        }

        OtpCode latestCode = activeCodes.get(0);

        // Check expiration
        if (latestCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("OTP code for user {} has expired", user.getUsername());
            return false;
        }

        // Check attempts limit
        if (latestCode.getAttempts() >= latestCode.getMaxAttempts()) {
            log.warn("Max OTP verification attempts reached for user {}", user.getUsername());
            return false;
        }

        // Increment attempts count
        latestCode.setAttempts(latestCode.getAttempts() + 1);
        otpCodeRepository.save(latestCode);

        // Verify hash matches
        if (passwordEncoder.matches(code, latestCode.getCodeHash())) {
            latestCode.setUsedAt(LocalDateTime.now());
            otpCodeRepository.save(latestCode);

            // Set user status to verified
            user.setIsVerified(true);
            userRepository.save(user);
            log.info("OTP successfully verified for user {}", user.getUsername());
            return true;
        }

        log.warn("Incorrect OTP code entered for user {}", user.getUsername());
        return false;
    }
}
