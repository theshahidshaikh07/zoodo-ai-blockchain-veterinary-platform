package com.zoodo.backend.repository;

import com.zoodo.backend.model.Appointment;
import com.zoodo.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    List<Appointment> findByPetId(UUID petId);

    List<Appointment> findByProviderId(UUID providerId);

    List<Appointment> findByPetOwnerId(User ownerId);

    List<Appointment> findByAppointmentDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<Appointment> findByStatus(Appointment.AppointmentStatus status);

    List<Appointment> findByAppointmentType(Appointment.AppointmentType appointmentType);
} 