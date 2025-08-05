package com.zoodo.backend.repository;

import com.zoodo.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    List<User> findByUserType(User.UserType userType);

    List<User> findByUserTypeAndSpecializationContainingIgnoreCase(User.UserType userType, String specialization);

    List<User> findByIsVerifiedTrue();

    List<User> findByIsActiveTrue();
} 