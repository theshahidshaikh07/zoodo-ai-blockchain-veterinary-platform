package com.zoodo.backend.repository;

import com.zoodo.backend.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PetRepository extends JpaRepository<Pet, UUID> {

    List<Pet> findByOwnerId(UUID ownerId);

    List<Pet> findBySpecies(String species);

    List<Pet> findBySpeciesAndBreedContainingIgnoreCase(String species, String breed);

    List<Pet> findByNameContainingIgnoreCase(String name);
}
