package com.zoodo.backend.controller;

import com.zoodo.backend.model.Appointment;
import com.zoodo.backend.service.AppointmentService;
import com.zoodo.backend.dto.AppointmentCreateRequest;
import com.zoodo.backend.dto.AppointmentUpdateRequest;
import com.zoodo.backend.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Appointment>> createAppointment(@Valid @RequestBody AppointmentCreateRequest request) {
        try {
            Appointment appointment = appointmentService.createAppointment(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment created successfully", appointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{appointmentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Appointment>> getAppointmentById(@PathVariable UUID appointmentId) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(appointmentId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment retrieved successfully", appointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/my-appointments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<Appointment>>> getCurrentUserAppointments() {
        try {
            List<Appointment> appointments = appointmentService.getCurrentUserAppointments();
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointments retrieved successfully", appointments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/provider-appointments")
    @PreAuthorize("hasAnyRole('VETERINARIAN', 'TRAINER')")
    public ResponseEntity<ApiResponse<List<Appointment>>> getProviderAppointments() {
        try {
            List<Appointment> appointments = appointmentService.getProviderAppointments();
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointments retrieved successfully", appointments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/pet/{petId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAppointmentsByPet(@PathVariable UUID petId) {
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByPet(petId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointments retrieved successfully", appointments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{appointmentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Appointment>> updateAppointment(@PathVariable UUID appointmentId, @Valid @RequestBody AppointmentUpdateRequest request) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointment(appointmentId, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment updated successfully", updatedAppointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{appointmentId}/status")
    @PreAuthorize("hasAnyRole('VETERINARIAN', 'TRAINER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Appointment>> updateAppointmentStatus(@PathVariable UUID appointmentId, @RequestParam String status) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment status updated successfully", updatedAppointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{appointmentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<String>> cancelAppointment(@PathVariable UUID appointmentId) {
        try {
            appointmentService.cancelAppointment(appointmentId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment cancelled successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/available-slots")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableSlots(
            @RequestParam UUID providerId,
            @RequestParam LocalDate date,
            @RequestParam String appointmentType) {
        try {
            List<String> availableSlots = appointmentService.getAvailableSlots(providerId, date, appointmentType);
            return ResponseEntity.ok(new ApiResponse<>(true, "Available slots retrieved successfully", availableSlots));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAppointmentsByProvider(@PathVariable UUID providerId) {
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByProvider(providerId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointments retrieved successfully", appointments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{appointmentId}/diagnosis")
    @PreAuthorize("hasAnyRole('VETERINARIAN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Appointment>> addDiagnosis(@PathVariable UUID appointmentId, @RequestBody String diagnosis) {
        try {
            Appointment updatedAppointment = appointmentService.addDiagnosis(appointmentId, diagnosis);
            return ResponseEntity.ok(new ApiResponse<>(true, "Diagnosis added successfully", updatedAppointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{appointmentId}/prescription")
    @PreAuthorize("hasAnyRole('VETERINARIAN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Appointment>> addPrescription(@PathVariable UUID appointmentId, @RequestBody String prescription) {
        try {
            Appointment updatedAppointment = appointmentService.addPrescription(appointmentId, prescription);
            return ResponseEntity.ok(new ApiResponse<>(true, "Prescription added successfully", updatedAppointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<Appointment>>> getUpcomingAppointments() {
        try {
            List<Appointment> appointments = appointmentService.getUpcomingAppointments();
            return ResponseEntity.ok(new ApiResponse<>(true, "Upcoming appointments retrieved successfully", appointments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/past")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<Appointment>>> getPastAppointments() {
        try {
            List<Appointment> appointments = appointmentService.getPastAppointments();
            return ResponseEntity.ok(new ApiResponse<>(true, "Past appointments retrieved successfully", appointments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{appointmentId}/payment")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Appointment>> processPayment(@PathVariable UUID appointmentId, @RequestBody Object paymentDetails) {
        try {
            Appointment updatedAppointment = appointmentService.processPayment(appointmentId, paymentDetails);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payment processed successfully", updatedAppointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
} 