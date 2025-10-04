package com.zoodo.backend.repository;

import com.zoodo.backend.model.Pet;
import com.zoodo.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PetRepository extends JpaRepository<Pet, UUID> {

    List<Pet> findByOwner(User owner);
    
    List<Pet> findByOwnerId(UUID ownerId);
    
    List<Pet> findBySpecies(String species);
    
    List<Pet> findBySpeciesAndBreedContainingIgnoreCase(String species, String breed);
    
    List<Pet> findByNameContainingIgnoreCase(String name);
    
    List<Pet> findBySpeciesAndGender(String species, Pet.Gender gender);
    
    @Query("SELECT p FROM Pet p JOIN p.owner u WHERE u.isActive = true AND p.blockchainRecordHash IS NOT NULL")
    List<Pet> findVerifiedPets();
    
    @Query("SELECT p FROM Pet p JOIN p.owner u WHERE u.userType = :userType AND u.isActive = true")
    List<Pet> findByOwnerType(@Param("userType") User.UserType userType);
    
    boolean existsByMicrochipId(String microchipId);
    
    Optional<Pet> findByMicrochipId(String microchipId);
}
