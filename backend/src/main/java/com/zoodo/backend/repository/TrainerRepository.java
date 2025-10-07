package com.zoodo.backend.repository;

import com.zoodo.backend.model.User;
import com.zoodo.backend.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, UUID> {
    
    Optional<Trainer> findByUser(User user);
    
    Optional<Trainer> findByUserId(UUID userId);
    
    @Query("SELECT t FROM Trainer t WHERE t.user.isActive = true AND t.offerHomeTraining = true")
    List<Trainer> findHomeTrainingProviders();
    
    @Query("SELECT t FROM Trainer t WHERE t.user.isActive = true AND t.hasAcademy = true")
    List<Trainer> findWithAcademyProviders();
    
    @Query("SELECT t FROM Trainer t WHERE t.user.isActive = true AND t.hasTrainingCenter = true")
    List<Trainer> findWithTrainingCenterProviders();
    
    @Query("SELECT t FROM Trainer t JOIN t.user u WHERE " +
           "u.city = :city AND u.state = :state AND u.isActive = true")
    List<Trainer> findByLocation(@Param("city") String city, @Param("state") String state);
    
    @Query("SELECT t FROM Trainer t WHERE t.user.isActive = true AND EXISTS (SELECT 1 FROM t.specializations s WHERE s IN :specializations)")
    List<Trainer> findBySpecializations(@Param("specializations") List<String> specializations);
    
    @Query("SELECT t FROM Trainer t WHERE t.user.isVerified = true AND t.user.isActive = true")
    List<Trainer> findVerifiedAndActiveTrainers();
    
    // TODO: Implement location-based search when latitude/longitude fields are added to User model
    // @Query("SELECT t FROM Trainer t WHERE t.user.isActive = true AND " +
    //        "FUNCTION('distance_in_km', FUNCTION('to_earth', t.user.latitude, t.user.longitude), " +
    //        "FUNCTION('ll_to_earth', :lat, :lng)) <= :radius")
    // List<Trainer> findWithinRadius(@Param("lat") Double latitude, 
    //                               @Param("lng") Double longitude, 
    //                               @Param("radius") Double radiusKm);
}



