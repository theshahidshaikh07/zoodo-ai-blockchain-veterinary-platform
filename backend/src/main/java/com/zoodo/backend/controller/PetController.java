package com.zoodo.backend.controller;

import com.zoodo.backend.model.Pet;
import com.zoodo.backend.service.PetService;
import com.zoodo.backend.dto.PetCreateRequest;
import com.zoodo.backend.dto.PetUpdateRequest;
import com.zoodo.backend.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetController {

    @Autowired
    private PetService petService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Pet>> createPet(@Valid @RequestBody PetCreateRequest request) {
        try {
            Pet pet = petService.createPet(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Pet created successfully", pet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{petId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Pet>> getPetById(@PathVariable UUID petId) {
        try {
            Pet pet = petService.getPetById(petId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Pet retrieved successfully", pet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasRole('USER') and #ownerId == authentication.principal.id")
    public ResponseEntity<ApiResponse<List<Pet>>> getPetsByOwner(@PathVariable UUID ownerId) {
        try {
            List<Pet> pets = petService.getPetsByOwner(ownerId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Pets retrieved successfully", pets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/my-pets")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<Pet>>> getCurrentUserPets() {
        try {
            List<Pet> pets = petService.getCurrentUserPets();
            return ResponseEntity.ok(new ApiResponse<>(true, "Pets retrieved successfully", pets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{petId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Pet>> updatePet(@PathVariable UUID petId, @Valid @RequestBody PetUpdateRequest request) {
        try {
            Pet updatedPet = petService.updatePet(petId, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Pet updated successfully", updatedPet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{petId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<String>> deletePet(@PathVariable UUID petId) {
        try {
            petService.deletePet(petId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Pet deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{petId}/medical-records")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<Object>>> getPetMedicalRecords(@PathVariable UUID petId) {
        try {
            List<Object> medicalRecords = petService.getPetMedicalRecords(petId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Medical records retrieved successfully", medicalRecords));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{petId}/medical-records")
    @PreAuthorize("hasAnyRole('VETERINARIAN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Object>> addMedicalRecord(@PathVariable UUID petId, @RequestBody Object medicalRecord) {
        try {
            Object record = petService.addMedicalRecord(petId, medicalRecord);
            return ResponseEntity.ok(new ApiResponse<>(true, "Medical record added successfully", record));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Pet>>> searchPets(
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String name) {
        try {
            List<Pet> pets = petService.searchPets(species, breed, name);
            return ResponseEntity.ok(new ApiResponse<>(true, "Pets found successfully", pets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/species/{species}")
    public ResponseEntity<ApiResponse<List<Pet>>> getPetsBySpecies(@PathVariable String species) {
        try {
            List<Pet> pets = petService.getPetsBySpecies(species);
            return ResponseEntity.ok(new ApiResponse<>(true, "Pets retrieved successfully", pets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{petId}/photo")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Pet>> updatePetPhoto(@PathVariable UUID petId, @RequestParam String photoUrl) {
        try {
            Pet updatedPet = petService.updatePetPhoto(petId, photoUrl);
            return ResponseEntity.ok(new ApiResponse<>(true, "Pet photo updated successfully", updatedPet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{petId}/blockchain-records")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Object>> getPetBlockchainRecords(@PathVariable UUID petId) {
        try {
            Object blockchainRecords = petService.getPetBlockchainRecords(petId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Blockchain records retrieved successfully", blockchainRecords));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
