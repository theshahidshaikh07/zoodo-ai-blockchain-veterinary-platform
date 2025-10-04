package com.zoodo.backend.repository;

import com.zoodo.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    List<User> findByUserType(User.UserType userType);


    List<User> findByIsVerifiedTrue();

    List<User> findByIsActiveTrue();
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
    
    long countByUserType(User.UserType userType);
    
    long countByIsActiveTrue();
    
    long countByIsVerifiedTrue();
    
    long countByCreatedAtAfter(java.time.LocalDateTime date);
} 