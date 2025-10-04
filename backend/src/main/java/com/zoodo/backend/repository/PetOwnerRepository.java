package com.zoodo.backend.repository;

import com.zoodo.backend.model.User;
import com.zoodo.backend.model.PetOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PetOwnerRepository extends JpaRepository<PetOwner, UUID> {
    
    Optional<PetOwner> findByUser(User user);
    
    Optional<PetOwner> findByUserId(UUID userId);
    
    boolean existsByUserId(UUID userId);
    
    @Query("SELECT po FROM PetOwner po WHERE po.user.isActive = true AND po.user.isVerified = true")
    java.util.List<PetOwner> findVerifiedAndActivePetOwners();
}



