package com.zoodo.backend.service;

import com.zoodo.backend.model.User;
import com.zoodo.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private VeterinarianRepository veterinarianRepository;
    
    @Autowired
    private TrainerRepository trainerRepository;
    
    @Autowired
    private HospitalRepository hospitalRepository;

    public Map<String, Object> getDashboardOverview(User user) {
        Map<String, Object> overview = new HashMap<>();
        
        switch (user.getUserType()) {
            case PET_OWNER:
                overview = getPetOwnerOverview(user);
                break;
            case VETERINARIAN:
                overview = getVeterinarianOverview(user);
                break;
            case TRAINER:
                overview = getTrainerOverview(user);
                break;
            case HOSPITAL:
            case CLINIC:
                overview = getHospitalOverview(user);
                break;
            default:
                overview.put("type", "unknown");
                overview.put("message", "Dashboard not available for this user type");
        }
        
        // Add common information
        overview.put("userType", user.getUserType().getValue());
        overview.put("username", user.getUsername());
        overview.put("isVerified", user.getIsVerified());
        overview.put("lastLogin", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        return overview;
    }

    private Map<String, Object> getPetOwnerOverview(User user) {
        Map<String, Object> overview = new HashMap<>();
        
        // Mock data for demonstration
        overview.put("petCount", 2);
        overview.put("upcomingAppointments", 1);
        overview.put("recentActivity", "Welcome back! You have 2 registered pets.");
        overview.put("quickActions", new String[]{
            "Add New Pet",
            "Book Appointment",
            "View Medical Records",
            "Find Veterinarians"
        });
        
        return overview;
    }

    private Map<String, Object> getVeterinarianOverview(User user) {
        Map<String, Object> overview = new HashMap<>();
        
        // Mock data for demonstration
        overview.put("licenseNumber", "VET-2024-001");
        overview.put("experience", 8);
        overview.put("specializations", new String[]{"Small Animal Medicine", "Surgery", "Emergency Care"});
        overview.put("upcomingAppointments", 5);
        overview.put("totalPatients", 150);
        overview.put("recentActivity", "Welcome back! You have 5 upcoming appointments.");
        overview.put("quickActions", new String[]{
            "View Appointments",
            "Manage Schedule",
            "View Patients",
            "Update Profile"
        });
        
        return overview;
    }

    private Map<String, Object> getTrainerOverview(User user) {
        Map<String, Object> overview = new HashMap<>();
        
        // Get trainer profile info
        var trainerOpt = trainerRepository.findByUserId(user.getId());
        if (trainerOpt.isPresent()) {
            var trainer = trainerOpt.get();
            overview.put("experience", trainer.getExperience());
            overview.put("specializations", trainer.getSpecializations());
            overview.put("hasAcademy", trainer.getHasAcademy());
            overview.put("hasTrainingCenter", trainer.getHasTrainingCenter());
            overview.put("isVerified", user.getIsVerified());
        }
        
        // Get upcoming sessions (if any)
        // TODO: Implement when appointment system is ready
        overview.put("upcomingSessions", 0);
        overview.put("totalClients", 0);
        
        // Get recent activity
        overview.put("recentActivity", "Welcome back! You have " + 
            (overview.get("upcomingSessions")) + " upcoming training sessions.");
        
        // Quick actions
        overview.put("quickActions", new String[]{
            "View Sessions",
            "Manage Schedule",
            "View Clients",
            "Update Profile"
        });
        
        return overview;
    }

    private Map<String, Object> getHospitalOverview(User user) {
        Map<String, Object> overview = new HashMap<>();
        
        // Get hospital profile info
        var hospitalOpt = hospitalRepository.findByUserId(user.getId());
        if (hospitalOpt.isPresent()) {
            var hospital = hospitalOpt.get();
            overview.put("businessName", hospital.getBusinessName());
            overview.put("accountType", hospital.getAccountType());
            overview.put("contactPerson", hospital.getContactPerson());
            overview.put("isVerified", hospital.getIsVerified());
        }
        
        // Get upcoming appointments (if any)
        // TODO: Implement when appointment system is ready
        overview.put("upcomingAppointments", 0);
        overview.put("totalPatients", 0);
        overview.put("staffCount", 0);
        
        // Get recent activity
        overview.put("recentActivity", "Welcome back! You have " + 
            (overview.get("upcomingAppointments")) + " upcoming appointments.");
        
        // Quick actions
        overview.put("quickActions", new String[]{
            "View Appointments",
            "Manage Staff",
            "View Patients",
            "Update Profile"
        });
        
        return overview;
    }

    public Map<String, Object> getDashboardStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        
        switch (user.getUserType()) {
            case PET_OWNER:
                stats = getPetOwnerStats(user);
                break;
            case VETERINARIAN:
                stats = getVeterinarianStats(user);
                break;
            case TRAINER:
                stats = getTrainerStats(user);
                break;
            case HOSPITAL:
            case CLINIC:
                stats = getHospitalStats(user);
                break;
            default:
                stats.put("message", "Stats not available for this user type");
        }
        
        return stats;
    }

    private Map<String, Object> getPetOwnerStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        
        var pets = petRepository.findByOwnerId(user);
        stats.put("totalPets", pets.size());
        stats.put("upcomingAppointments", 0); // TODO: Implement
        stats.put("totalAppointments", 0); // TODO: Implement
        stats.put("medicalRecords", 0); // TODO: Implement
        
        return stats;
    }

    private Map<String, Object> getVeterinarianStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("upcomingAppointments", 0); // TODO: Implement
        stats.put("totalAppointments", 0); // TODO: Implement
        stats.put("totalPatients", 0); // TODO: Implement
        stats.put("monthlyEarnings", 0); // TODO: Implement
        
        return stats;
    }

    private Map<String, Object> getTrainerStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("upcomingSessions", 0); // TODO: Implement
        stats.put("totalSessions", 0); // TODO: Implement
        stats.put("totalClients", 0); // TODO: Implement
        stats.put("monthlyEarnings", 0); // TODO: Implement
        
        return stats;
    }

    private Map<String, Object> getHospitalStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("upcomingAppointments", 0); // TODO: Implement
        stats.put("totalAppointments", 0); // TODO: Implement
        stats.put("totalPatients", 0); // TODO: Implement
        stats.put("staffCount", 0); // TODO: Implement
        
        return stats;
    }

    public Map<String, Object> getRecentActivity(User user) {
        Map<String, Object> activity = new HashMap<>();
        
        // TODO: Implement recent activity tracking
        activity.put("activities", new String[]{
            "Profile updated",
            "Last login: " + LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        });
        
        return activity;
    }
}
