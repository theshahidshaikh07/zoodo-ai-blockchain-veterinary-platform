package com.zoodo.backend.exception;

import com.zoodo.backend.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.error("Illegal argument exception: {}", ex.getMessage());
        
        // Check if the message matches any of our error codes
        for (ErrorCodes errorCode : ErrorCodes.values()) {
            if (errorCode.getMessage().equals(ex.getMessage())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(
                        errorCode.getMessage(),
                        errorCode.getCode(),
                        errorCode.getType()
                    ));
            }
        }
        
        // Default handling for other illegal arguments
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(
                ex.getMessage(),
                "INVALID_ARGUMENT",
                "VALIDATION"
            ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.error("Validation exception: {}", ex.getMessage());
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(
                "Validation failed",
                ErrorCodes.INVALID_INPUT.getCode(),
                ErrorCodes.INVALID_INPUT.getType(),
                errors
            ));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Object>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        log.error("File size exceeded: {}", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(
                ErrorCodes.FILE_TOO_LARGE.getMessage(),
                ErrorCodes.FILE_TOO_LARGE.getCode(),
                ErrorCodes.FILE_TOO_LARGE.getType()
            ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        log.error("Runtime exception: {}", ex.getMessage(), ex);
        
        // Check for specific runtime exceptions
        if (ex.getMessage() != null) {
            if (ex.getMessage().contains("Invalid email or password")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(
                        ErrorCodes.INVALID_CREDENTIALS.getMessage(),
                        ErrorCodes.INVALID_CREDENTIALS.getCode(),
                        ErrorCodes.INVALID_CREDENTIALS.getType()
                    ));
            }
            if (ex.getMessage().contains("Account is deactivated")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(
                        ErrorCodes.ACCOUNT_DISABLED.getMessage(),
                        ErrorCodes.ACCOUNT_DISABLED.getCode(),
                        ErrorCodes.ACCOUNT_DISABLED.getType()
                    ));
            }
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(
                ErrorCodes.INTERNAL_SERVER_ERROR.getMessage(),
                ErrorCodes.INTERNAL_SERVER_ERROR.getCode(),
                ErrorCodes.INTERNAL_SERVER_ERROR.getType()
            ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        log.error("Unexpected exception: {}", ex.getMessage(), ex);
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(
                ErrorCodes.INTERNAL_SERVER_ERROR.getMessage(),
                ErrorCodes.INTERNAL_SERVER_ERROR.getCode(),
                ErrorCodes.INTERNAL_SERVER_ERROR.getType()
            ));
    }
}
