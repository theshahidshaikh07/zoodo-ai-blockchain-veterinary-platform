# Authentication & Profile Management System - Setup Guide

## 🎯 Overview
This guide covers the complete authentication and profile management system for all user types in the Zoodo platform.

## 🔐 Authentication System

### Features:
- ✅ **Login/Logout** for all user types
- ✅ **JWT Token Authentication**
- ✅ **Password Change** functionality
- ✅ **Token Verification**
- ✅ **Profile Management** for each user type
- ✅ **Dashboard Overview** with user-specific data
- ✅ **Document Upload/Management**
- ✅ **Verification Status** tracking

## 📋 API Endpoints

### Authentication Endpoints:
```
POST /api/auth/login          - User login
POST /api/auth/logout         - User logout
GET  /api/auth/profile        - Get user profile
PUT  /api/auth/profile        - Update user profile
POST /api/auth/change-password - Change password
GET  /api/auth/verify-token   - Verify JWT token
```

### Dashboard Endpoints:
```
GET /api/dashboard/overview      - Get dashboard overview
GET /api/dashboard/stats         - Get dashboard statistics
GET /api/dashboard/recent-activity - Get recent activity
```

### Profile Management Endpoints:
```
GET    /api/profile/professional        - Get professional profile
PUT    /api/profile/professional        - Update professional profile
POST   /api/profile/upload-document     - Upload document
DELETE /api/profile/document/{type}     - Delete document
GET    /api/profile/verification-status - Get verification status
POST   /api/profile/request-verification - Request verification
```

## 🚀 Setup Instructions

### 1. Database Setup
```bash
# Ensure your database is set up with the clean schema
psql zoodo < db/clean_init.sql
```

### 2. Backend Configuration
Update your `application.properties`:
```properties
# JWT Configuration
jwt.secret=zoodoSecretKeyForJWTTokenGenerationAndValidation2024
jwt.expiration=86400000

# Security Configuration
spring.security.user.name=admin
spring.security.user.password=admin
```

### 3. Start Backend Server
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 4. Test Authentication System
```bash
# Test all authentication and profile endpoints
.\test-auth-profile-endpoints.ps1
```

## 👥 User Type Specific Features

### 🐕 Pet Owner Dashboard:
- **Overview**: Pet count, upcoming appointments
- **Profile**: Basic user information, pet management
- **Quick Actions**: Add pet, book appointment, find veterinarians

### 🩺 Veterinarian Dashboard:
- **Overview**: License info, experience, specializations
- **Profile**: Professional details, service offerings, availability
- **Documents**: License proof, ID proof, degree proof, profile photo
- **Quick Actions**: View appointments, manage schedule, update profile

### 🎾 Trainer Dashboard:
- **Overview**: Experience, specializations, academy/training center info
- **Profile**: Professional details, practice type, service offerings
- **Documents**: Resume, profile photo
- **Quick Actions**: View sessions, manage schedule, update profile

### 🏥 Hospital/Clinic Dashboard:
- **Overview**: Business info, contact person, services offered
- **Profile**: Business details, compliance information
- **Documents**: Facility license document
- **Quick Actions**: View appointments, manage staff, update profile

## 🔧 Frontend Integration

### 1. Login Component
```typescript
const login = async (username: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};
```

### 2. Dashboard Component
```typescript
const getDashboardOverview = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/dashboard/overview', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return await response.json();
};
```

### 3. Profile Management
```typescript
const updateProfile = async (profileData: any) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  
  return await response.json();
};
```

## 🧪 Testing

### Test Authentication Flow:
1. **Register a user** (pet owner, veterinarian, trainer, or hospital)
2. **Login** with credentials
3. **Get profile** information
4. **Update profile** details
5. **Change password**
6. **Access dashboard** overview
7. **Logout**

### Test Profile Management:
1. **Get professional profile** (for vets, trainers, hospitals)
2. **Update professional details**
3. **Upload documents** (if applicable)
4. **Check verification status**
5. **Request verification** (if needed)

## 📊 Dashboard Data Structure

### Pet Owner Dashboard:
```json
{
  "userType": "pet_owner",
  "petCount": 2,
  "upcomingAppointments": 0,
  "recentActivity": "Welcome back! You have 2 registered pets.",
  "quickActions": ["Add New Pet", "Book Appointment", "View Medical Records", "Find Veterinarians"]
}
```

### Veterinarian Dashboard:
```json
{
  "userType": "veterinarian",
  "licenseNumber": "VET123456",
  "experience": 10,
  "specializations": ["General Practice", "Surgery"],
  "upcomingAppointments": 0,
  "totalPatients": 0,
  "quickActions": ["View Appointments", "Manage Schedule", "View Patients", "Update Profile"]
}
```

### Trainer Dashboard:
```json
{
  "userType": "trainer",
  "experience": 8,
  "specializations": ["Behavioral Modification", "Basic Obedience Training"],
  "hasAcademy": true,
  "hasTrainingCenter": false,
  "upcomingSessions": 0,
  "totalClients": 0,
  "quickActions": ["View Sessions", "Manage Schedule", "View Clients", "Update Profile"]
}
```

### Hospital Dashboard:
```json
{
  "userType": "hospital",
  "businessName": "Main Veterinary Hospital",
  "accountType": "hospital",
  "contactPerson": "Dr. Robert Johnson",
  "upcomingAppointments": 0,
  "totalPatients": 0,
  "staffCount": 0,
  "quickActions": ["View Appointments", "Manage Staff", "View Patients", "Update Profile"]
}
```

## 🔒 Security Features

### JWT Token:
- **Expiration**: 24 hours (configurable)
- **Secret Key**: Configurable in application.properties
- **Token Verification**: Automatic on protected endpoints

### Password Security:
- **BCrypt Hashing**: All passwords are hashed
- **Password Change**: Requires current password verification
- **Minimum Length**: 6 characters (configurable)

### Profile Security:
- **User Isolation**: Users can only access their own data
- **Document Upload**: Secure file storage with type validation
- **Verification**: Admin-controlled verification system

## 🚨 Troubleshooting

### Common Issues:

#### 1. Authentication Failed
- Check username/password
- Verify user account is active
- Check JWT token expiration

#### 2. Profile Update Failed
- Verify all required fields
- Check field validation rules
- Ensure user has permission

#### 3. Document Upload Failed
- Check file size limits
- Verify file type is allowed
- Check upload directory permissions

#### 4. Dashboard Data Missing
- Verify user type is correct
- Check database relationships
- Ensure profile data exists

### Debug Commands:
```bash
# Check user authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/auth/verify-token

# Test profile access
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/auth/profile

# Check dashboard data
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/dashboard/overview
```

## ✅ Success Checklist

- [ ] Database schema applied successfully
- [ ] Backend server starts without errors
- [ ] Authentication endpoints work
- [ ] Profile management works for all user types
- [ ] Dashboard shows correct data for each user type
- [ ] Document upload works (for applicable user types)
- [ ] Password change functionality works
- [ ] JWT token authentication works
- [ ] Frontend can integrate with all endpoints
- [ ] All user types can login and access their dashboards

## 🎉 Next Steps

1. **Frontend Integration** - Connect your React components to these endpoints
2. **OAuth Integration** - Add Google OAuth after basic auth is working
3. **Advanced Features** - Add appointment booking, messaging, etc.
4. **Admin Panel** - Create admin interface for user verification
5. **Mobile App** - Extend API for mobile application

Your authentication and profile management system is now ready! 🚀
