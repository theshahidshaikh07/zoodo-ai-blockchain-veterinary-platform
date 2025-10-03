package com.zoodo.backend.repository;

import com.zoodo.backend.model.VetProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VetProfileRepository extends JpaRepository<VetProfile, UUID> {
    Optional<VetProfile> findByUserId(UUID userId);
}


