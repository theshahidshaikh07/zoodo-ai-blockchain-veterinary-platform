package com.zoodo.backend.exception;

public enum ErrorCodes {
    // Authentication Errors
    INVALID_CREDENTIALS("AUTH_001", "Invalid username or password", "AUTHENTICATION"),
    ACCOUNT_LOCKED("AUTH_002", "Account is locked due to multiple failed attempts", "AUTHENTICATION"),
    ACCOUNT_DISABLED("AUTH_003", "Account is disabled", "AUTHENTICATION"),
    ACCOUNT_NOT_VERIFIED("AUTH_004", "Account is not verified", "AUTHENTICATION"),
    TOKEN_EXPIRED("AUTH_005", "Authentication token has expired", "AUTHENTICATION"),
    TOKEN_INVALID("AUTH_006", "Invalid authentication token", "AUTHENTICATION"),
    SESSION_EXPIRED("AUTH_007", "Session has expired", "AUTHENTICATION"),
    
    // Registration Errors
    USERNAME_ALREADY_EXISTS("REG_001", "Username already exists", "REGISTRATION"),
    EMAIL_ALREADY_EXISTS("REG_002", "Email address already exists", "REGISTRATION"),
    LICENSE_ALREADY_EXISTS("REG_003", "License number already exists", "REGISTRATION"),
    FACILITY_LICENSE_EXISTS("REG_004", "Facility license number already exists", "REGISTRATION"),
    GOVT_REGISTRATION_EXISTS("REG_005", "Government registration number already exists", "REGISTRATION"),
    TAX_ID_EXISTS("REG_006", "Tax ID already exists", "REGISTRATION"),
    INVALID_EMAIL_FORMAT("REG_007", "Invalid email format", "REGISTRATION"),
    WEAK_PASSWORD("REG_008", "Password does not meet security requirements", "REGISTRATION"),
    PASSWORDS_DO_NOT_MATCH("REG_009", "Passwords do not match", "REGISTRATION"),
    REQUIRED_FIELD_MISSING("REG_010", "Required field is missing", "REGISTRATION"),
    
    // Validation Errors
    INVALID_INPUT("VAL_001", "Invalid input provided", "VALIDATION"),
    FILE_TOO_LARGE("VAL_002", "File size exceeds maximum limit", "VALIDATION"),
    INVALID_FILE_TYPE("VAL_003", "Invalid file type", "VALIDATION"),
    INVALID_DATE_FORMAT("VAL_004", "Invalid date format", "VALIDATION"),
    INVALID_PHONE_NUMBER("VAL_005", "Invalid phone number format", "VALIDATION"),
    INVALID_POSTAL_CODE("VAL_006", "Invalid postal code format", "VALIDATION"),
    
    // Business Logic Errors
    APPOINTMENT_NOT_FOUND("BIZ_001", "Appointment not found", "BUSINESS"),
    PET_NOT_FOUND("BIZ_002", "Pet not found", "BUSINESS"),
    USER_NOT_FOUND("BIZ_003", "User not found", "BUSINESS"),
    PROVIDER_NOT_AVAILABLE("BIZ_004", "Provider is not available at the requested time", "BUSINESS"),
    APPOINTMENT_ALREADY_EXISTS("BIZ_005", "Appointment already exists at this time", "BUSINESS"),
    INSUFFICIENT_PERMISSIONS("BIZ_006", "Insufficient permissions to perform this action", "BUSINESS"),
    
    // System Errors
    INTERNAL_SERVER_ERROR("SYS_001", "Internal server error", "SYSTEM"),
    DATABASE_ERROR("SYS_002", "Database operation failed", "SYSTEM"),
    FILE_UPLOAD_ERROR("SYS_003", "File upload failed", "SYSTEM"),
    EXTERNAL_SERVICE_ERROR("SYS_004", "External service unavailable", "SYSTEM"),
    NETWORK_ERROR("SYS_005", "Network connection error", "SYSTEM"),
    
    // Rate Limiting
    RATE_LIMIT_EXCEEDED("RATE_001", "Too many requests. Please try again later", "RATE_LIMIT"),
    
    // OAuth Errors
    OAUTH_PROVIDER_ERROR("OAUTH_001", "OAuth provider error", "OAUTH"),
    OAUTH_CANCELLED("OAUTH_002", "OAuth authentication cancelled", "OAUTH"),
    OAUTH_ACCOUNT_EXISTS("OAUTH_003", "Account already exists with this email", "OAUTH");

    private final String code;
    private final String message;
    private final String type;

    ErrorCodes(String code, String message, String type) {
        this.code = code;
        this.message = message;
        this.type = type;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public String getType() {
        return type;
    }
}
