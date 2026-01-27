const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errorCode?: string;
  errorType?: string;
  details?: any;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'pet_owner' | 'veterinarian' | 'trainer' | 'hospital' | 'clinic' | 'admin';
  phone?: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  username?: string;
  isVerified?: boolean;
  isActive?: boolean;
  status?: string;
  profilePhotoUrl?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  rating?: number;
  totalReviews?: number;
  verifiedAt?: string;
  verifiedBy?: string;
  lastLoginAt?: string;
  profileCompletion?: number;
}

export interface UserCreateRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  phone?: string;
  address?: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: string;
  phone?: string;
  address?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  petId: string;
  providerId: string;
  appointmentDate: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: 'checkup' | 'vaccination' | 'surgery' | 'training' | 'consultation';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// AI Service interfaces
export interface AIChatRequest {
  message: string;
  session_id?: string;
}

export interface AIChatResponse {
  response: string;
  session_id: string;
  timestamp: string;
  pet_profile: {
    species: string | null;
    breed: string | null;
    age: string | null;
    weight: string | null;
    gender: string | null;
    name: string | null;
    medical_history: any[];
    current_symptoms: any[];
    medications: any[];
  };
  location_set: boolean;
  emergency_detected: boolean;
}

export interface AIHealthCheck {
  status: string;
  ai_vet: boolean;
  provider: string;
}

class ApiService {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    };

    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Add JWT token if available
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const defaultOptions: RequestInit = {
      headers,
      ...options,
    };

    try {
      console.log('Making request to:', url);
      console.log('Request options:', defaultOptions);
      console.log('Body type:', typeof defaultOptions.body);
      console.log('Body instanceof FormData:', defaultOptions.body instanceof FormData);

      const response = await fetch(url, defaultOptions);

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Handle non-JSON responses
        const text = await response.text();
        if (text.trim() === '') {
          // Empty response - return a default success response
          return {
            success: true,
            message: 'Request completed successfully',
            data: undefined
          } as ApiResponse<T>;
        }
        throw new Error(`Expected JSON response but got: ${contentType}`);
      }

      // Try to parse JSON
      let data: ApiResponse<T>;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);

      // Return a structured error response
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiResponse<T>;
    }
  }

  // User endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(userData: UserCreateRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: UserUpdateRequest): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async registerUser(userData: FormData | Record<string, unknown>): Promise<ApiResponse<User>> {
    // Route JSON vs multipart requests to appropriate endpoints
    const isForm = typeof FormData !== 'undefined' && userData instanceof FormData;
    if (isForm) {
      const form = userData as FormData;
      const isVetMultipart = form.has('licenseNumber') || form.has('licenseProof') || form.has('independentServices') || form.has('availabilitySchedule');
      const isTrainerMultipart = form.has('registrationData') && (form.has('resume') || form.has('profilePhoto'));
      const isHospitalMultipart = form.has('facilityLicenseNumber') || form.has('facilityLicenseDocument');

      let endpoint = '/register/pet-owner';
      if (isVetMultipart) {
        // For veterinarian registration, use the direct endpoint that expects individual form parts
        endpoint = '/register/veterinarian';
      } else if (isTrainerMultipart) {
        // Frontend already provides registrationData, no need to create it
        endpoint = '/register/trainer';
      } else if (isHospitalMultipart) {
        const registrationData = this.createHospitalRegistrationData(form);
        form.set('registrationData', JSON.stringify(registrationData));
        endpoint = '/register/hospital';
      }

      return this.request<User>(endpoint, {
        method: 'POST',
        body: form,
      });
    }
    return this.request<User>('/register/pet-owner', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  private createVeterinarianRegistrationData(form: FormData): any {
    return {
      username: form.get('username') as string,
      firstName: form.get('firstName') as string,
      lastName: form.get('lastName') as string,
      email: form.get('email') as string,
      password: form.get('password') as string,
      phoneNumber: form.get('phoneNumber') as string,
      address: form.get('address') as string,
      licenseNumber: form.get('licenseNumber') as string,
      experience: form.get('experience') ? parseInt(form.get('experience') as string) : 0,
      specialization: this.getArrayFromFormData(form, 'specialization'),
      qualifications: this.getArrayFromFormData(form, 'qualifications'),
      otherSpecialization: form.get('otherSpecialization') as string,
      otherQualification: form.get('otherQualification') as string,
      isAffiliated: form.get('isAffiliated') === 'true',
      affiliatedFacilityName: form.get('affiliatedDetails.facilityName') as string,
      affiliatedType: form.get('affiliatedDetails.affiliationType') as string,
      otherFacilityName: form.get('affiliatedDetails.otherFacilityName') as string,
      offerOnlineConsultation: form.get('independentServices.onlineConsultation') === 'true',
      offerHomeVisits: form.get('independentServices.homeConsultation') === 'true',
      homeServiceSameAsPersonal: form.get('independentServices.serviceAddress.sameAsPersonal') === 'true',
      homeServiceStreet: form.get('independentServices.serviceAddress.street') as string,
      homeServiceCity: form.get('independentServices.serviceAddress.city') as string,
      homeServiceZip: form.get('independentServices.serviceAddress.zip') as string,
      homeVisitRadius: form.get('independentServices.homeVisitRadius') ? parseInt(form.get('independentServices.homeVisitRadius') as string) : 0,
      independentServices: form.get('independentServices') as string,
      availabilitySchedule: form.get('availabilitySchedule') as string
    };
  }

  private createTrainerRegistrationData(form: FormData): any {
    return {
      username: form.get('username') as string,
      firstName: form.get('firstName') as string,
      lastName: form.get('lastName') as string,
      email: form.get('email') as string,
      password: form.get('password') as string,
      phoneNumber: form.get('phoneNumber') as string,
      address: form.get('address') as string,
      experience: form.get('experience') ? parseInt(form.get('experience') as string) : 0,
      specialization: this.getArrayFromFormData(form, 'specialization'),
      certifications: this.getArrayFromFormData(form, 'certifications'),
      otherSpecialization: form.get('otherSpecialization') as string,
      otherCertification: form.get('otherCertification') as string,
      practiceType: form.get('practiceType') as string,
      offerHomeTraining: form.get('offerHomeTraining') === 'true',
      independentServiceSameAsPersonal: form.get('independentServiceSameAsPersonal') === 'true',
      independentServiceStreet: form.get('independentServiceStreet') as string,
      independentServiceCity: form.get('independentServiceCity') as string,
      independentServiceZip: form.get('independentServiceZip') as string,
      homeTrainingRadius: form.get('homeTrainingRadius') ? parseInt(form.get('homeTrainingRadius') as string) : 1,
      hasTrainingCenter: form.get('hasTrainingCenter') === 'true',
      trainingCenterName: form.get('trainingCenterName') as string,
      trainingCenterAddress: form.get('trainingCenterAddress') as string,
      hasAcademy: form.get('hasAcademy') === 'true',
      academyName: form.get('academyName') as string,
      academyStreet: form.get('academyStreet') as string,
      academyCity: form.get('academyCity') as string,
      academyState: form.get('academyState') as string,
      academyPostalCode: form.get('academyPostalCode') as string,
      academyCountry: form.get('academyCountry') as string,
      academyPhone: form.get('academyPhone') as string,
      independentServices: form.get('independentServices') as string,
      availabilitySchedule: form.get('availabilitySchedule') as string
    };
  }

  private createHospitalRegistrationData(form: FormData): any {
    return {
      username: form.get('username') as string,
      firstName: form.get('firstName') as string,
      lastName: form.get('lastName') as string,
      email: form.get('email') as string,
      password: form.get('password') as string,
      phoneNumber: form.get('phoneNumber') as string,
      address: form.get('address') as string,
      facilityName: form.get('facilityName') as string,
      facilityLicenseNumber: form.get('facilityLicenseNumber') as string,
    };
  }

  private getArrayFromFormData(form: FormData, key: string): string[] {
    const values: string[] = [];
    for (const [formKey, value] of form.entries()) {
      if (formKey === key && typeof value === 'string') {
        values.push(value);
      }
    }
    return values;
  }

  async loginUser(credentials: {
    usernameOrEmail: string;
    password: string;
  }): Promise<ApiResponse<string>> {
    try {
      // Backend expects { email, password } where email can be either email or username
      const response = await this.request<string>('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email: credentials.usernameOrEmail, password: credentials.password }),
      });

      // Store JWT token if login is successful
      if (response.success && response.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('jwt_token', response.data);
        }
      }

      return response;
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async loginAdmin(credentials: {
    usernameOrEmail: string;
    password: string;
  }): Promise<ApiResponse<{ token: string }>> {
    const response = await this.request<{ token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store JWT token if login is successful
    if (response.success && response.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt_token', response.data.token);
      }
    }

    return response;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
    }
  }

  // Google OAuth methods
  initiateGoogleLogin(): void {
    if (typeof window !== 'undefined') {
      window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    }
  }

  async handleGoogleCallback(): Promise<ApiResponse<{
    token?: string;
    action: 'login' | 'register';
    email?: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/oauth/google/success`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data?.action === 'login' && data.data?.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('jwt_token', data.data.token);
        }
      }

      return data;
    } catch (error) {
      console.error('Google OAuth callback failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Google OAuth failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile');
  }

  async updateUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Pet endpoints
  async createPet(petData: {
    name: string;
    species: string;
    breed?: string;
    age?: number;
    weight?: number;
  }): Promise<ApiResponse<Pet>> {
    return this.request<Pet>('/pets', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  }

  async getPets(): Promise<ApiResponse<Pet[]>> {
    return this.request<Pet[]>('/pets');
  }

  async getPetById(petId: string): Promise<ApiResponse<Pet>> {
    return this.request<Pet>(`/pets/${petId}`);
  }

  async updatePet(petId: string, petData: Partial<Pet>): Promise<ApiResponse<Pet>> {
    return this.request<Pet>(`/pets/${petId}`, {
      method: 'PUT',
      body: JSON.stringify(petData),
    });
  }

  async deletePet(petId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/pets/${petId}`, {
      method: 'DELETE',
    });
  }

  // Appointment endpoints
  async createAppointment(appointmentData: {
    petId: string;
    providerId: string;
    appointmentDate: string;
    type: string;
    notes?: string;
  }): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    return this.request<Appointment[]>('/appointments');
  }

  async getAppointmentById(appointmentId: string): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${appointmentId}`);
  }

  async updateAppointment(
    appointmentId: string,
    appointmentData: Partial<Appointment>
  ): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async cancelAppointment(appointmentId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
    });
  }

  // Provider endpoints
  async getProviders(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users/providers');
  }

  async getProviderById(providerId: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/providers/${providerId}`);
  }

  // Admin endpoints
  async getUsersAdmin(params?: {
    page?: number;
    size?: number;
    userType?: string;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<{
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.userType) queryParams.append('userType', params.userType);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getUserDetails(userId: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/users/${userId}`);
  }

  async updateUserStatus(userId: string, status: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteUserAdmin(userId: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getSystemStats(): Promise<ApiResponse<any>> {
    return this.request('/admin/stats');
  }

  async exportUsers(params?: {
    userType?: string;
    status?: string;
  }): Promise<ApiResponse<User[]>> {
    const queryParams = new URLSearchParams();
    if (params?.userType) queryParams.append('userType', params.userType);
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `/admin/users/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  // Registration Management Endpoints

  // Pet Owner Registration
  async createPetOwnerRegistration(registrationData: any): Promise<ApiResponse<any>> {
    return this.request('/register/pet-owner', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  async getPetOwnerRegistration(id: string): Promise<ApiResponse<any>> {
    return this.request(`/register/pet-owner/${id}`);
  }

  async updatePetOwnerRegistration(id: string, registrationData: any): Promise<ApiResponse<any>> {
    return this.request(`/register/pet-owner/${id}`, {
      method: 'PUT',
      body: JSON.stringify(registrationData),
    });
  }

  async approvePetOwnerRegistration(id: string): Promise<ApiResponse<User>> {
    return this.request(`/register/pet-owner/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectPetOwnerRegistration(id: string, reason: string): Promise<ApiResponse<any>> {
    return this.request(`/register/pet-owner/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getPetOwnerRegistrationsByStatus(status: string): Promise<ApiResponse<any[]>> {
    return this.request(`/register/pet-owner/status/${status}`);
  }

  async getActivePetOwnerRegistrations(): Promise<ApiResponse<any[]>> {
    return this.request('/register/pet-owner/active');
  }

  // Veterinarian Registration
  async createVeterinarianRegistration(registrationData: FormData): Promise<ApiResponse<any>> {
    return this.request('/register/veterinarian', {
      method: 'POST',
      body: registrationData,
    });
  }

  async getVeterinarianRegistration(id: string): Promise<ApiResponse<any>> {
    return this.request(`/register/veterinarian/${id}`);
  }

  async updateVeterinarianRegistration(id: string, registrationData: any): Promise<ApiResponse<any>> {
    return this.request(`/register/veterinarian/${id}`, {
      method: 'PUT',
      body: JSON.stringify(registrationData),
    });
  }

  async approveVeterinarianRegistration(id: string): Promise<ApiResponse<User>> {
    return this.request(`/register/veterinarian/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectVeterinarianRegistration(id: string, reason: string): Promise<ApiResponse<any>> {
    return this.request(`/register/veterinarian/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getVeterinarianRegistrationsByStatus(status: string): Promise<ApiResponse<any[]>> {
    return this.request(`/register/veterinarian/status/${status}`);
  }

  // Trainer Registration
  async createTrainerRegistration(registrationData: FormData): Promise<ApiResponse<any>> {
    return this.request('/register/trainer', {
      method: 'POST',
      body: registrationData,
    });
  }

  async getTrainerRegistration(id: string): Promise<ApiResponse<any>> {
    return this.request(`/register/trainer/${id}`);
  }

  async updateTrainerRegistration(id: string, registrationData: any): Promise<ApiResponse<any>> {
    return this.request(`/register/trainer/${id}`, {
      method: 'PUT',
      body: JSON.stringify(registrationData),
    });
  }

  async approveTrainerRegistration(id: string): Promise<ApiResponse<User>> {
    return this.request(`/register/trainer/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectTrainerRegistration(id: string, reason: string): Promise<ApiResponse<any>> {
    return this.request(`/register/trainer/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getTrainerRegistrationsByStatus(status: string): Promise<ApiResponse<any[]>> {
    return this.request(`/register/trainer/status/${status}`);
  }

  // Hospital/Clinic Registration
  async createHospitalClinicRegistration(registrationData: any): Promise<ApiResponse<any>> {
    return this.request('/register/hospital', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  async getHospitalClinicRegistration(id: string): Promise<ApiResponse<any>> {
    return this.request(`/register/hospital/${id}`);
  }

  async updateHospitalClinicRegistration(id: string, registrationData: any): Promise<ApiResponse<any>> {
    return this.request(`/register/hospital/${id}`, {
      method: 'PUT',
      body: JSON.stringify(registrationData),
    });
  }

  async approveHospitalClinicRegistration(id: string): Promise<ApiResponse<User>> {
    return this.request(`/register/hospital/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectHospitalClinicRegistration(id: string, reason: string): Promise<ApiResponse<any>> {
    return this.request(`/register/hospital/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getHospitalClinicRegistrationsByStatus(status: string): Promise<ApiResponse<any[]>> {
    return this.request(`/register/hospital/status/${status}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    // Health endpoint is at /health, not /api/health
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8080';
    const response = await fetch(`${baseUrl}/health`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      if (text.trim() === '') {
        return {
          success: true,
          message: 'Health check completed',
          data: { status: 'healthy' }
        } as ApiResponse<{ status: string }>;
      }
      throw new Error(`Expected JSON response but got: ${contentType}`);
    }

    try {
      const data = await response.json();
      return data;
    } catch (parseError) {
      console.error('Failed to parse health check JSON:', parseError);
      throw new Error('Invalid JSON response from health check');
    }
  }

  // AI Service endpoints
  async chatWithAI(request: AIChatRequest): Promise<ApiResponse<AIChatResponse>> {
    try {
      console.log('Sending AI request:', request); // Debug log

      const response = await fetch(`${AI_SERVICE_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`AI Service error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI Service response:', data); // Debug log

      // The backend returns { success, data: { response, is_emergency, ... } }
      return data;
    } catch (error) {
      console.error('AI Service request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'AI Service unavailable',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAIHealthCheck(): Promise<ApiResponse<AIHealthCheck>> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/v1/health`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`AI Service health check failed! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: 'AI Service health check completed',
        data: data
      };
    } catch (error) {
      console.error('AI Service health check failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'AI Service unavailable',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAIInfo(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/ai-vet/info`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`AI Service info request failed! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: 'AI Service info retrieved',
        data: data
      };
    } catch (error) {
      console.error('AI Service info request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'AI Service unavailable',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

}

export const apiService = new ApiService(); 