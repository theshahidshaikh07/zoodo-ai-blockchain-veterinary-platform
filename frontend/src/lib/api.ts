const LOCAL_API_URL = 'http://127.0.0.1:8000/api/v1';
const CLOUD_API_URL = 'https://zoodo-core-api.onrender.com/api/v1';
const PRIMARY_API_URL = process.env.NEXT_PUBLIC_API_URL || LOCAL_API_URL;
const API_BASE_URL = PRIMARY_API_URL;
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://127.0.0.1:8000';

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
  conversation_history?: Array<{ role: string; content: string; }>;
  location?: { latitude: number; longitude: number; };
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
  action_required?: string;
  places_data?: any[];
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

  private getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host.includes('zoodo.dev') || host.includes('vercel.app')) {
        return CLOUD_API_URL;
      }
    }
    return PRIMARY_API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}${endpoint}`;

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
      const response = await fetch(url, defaultOptions);

      // Check if response is ok
      if (!response.ok) {
        try {
          const errBody = await response.json();
          return errBody;
        } catch {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (text.trim() === '') {
          return {
            success: true,
            message: 'Request completed successfully',
            data: undefined
          } as ApiResponse<T>;
        }
        throw new Error(`Expected JSON response but got: ${contentType}`);
      }

      return await response.json();
    } catch (error: any) {
      // Automatic fallback to cloud Render backend if local host (127.0.0.1:8000) is unreachable
      if (baseUrl !== CLOUD_API_URL) {
        console.warn(`Local backend at ${baseUrl} unreachable. Retrying via live Cloud API...`);
        try {
          const fallbackUrl = `${CLOUD_API_URL}${endpoint}`;
          const fallbackResponse = await fetch(fallbackUrl, defaultOptions);
          if (fallbackResponse.ok) {
            return await fallbackResponse.json();
          } else {
            try {
              return await fallbackResponse.json();
            } catch {}
          }
        } catch (fallbackError) {
          console.error('Fallback cloud API also unreachable:', fallbackError);
        }
      }

      console.error('API request failed:', error);

      // Return a structured error response
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiResponse<T>;
    }
  }

  // Username verification endpoint (Instagram style)
  async checkUsername(username: string): Promise<ApiResponse<{ available: boolean; username: string; message: string; suggestions?: string[] }>> {
    const clean = username.replace(/^@/, '').trim();
    return this.request<{ available: boolean; username: string; message: string; suggestions?: string[] }>(
      `/users/check-username?username=${encodeURIComponent(clean)}`
    );
  }

  // Email verification check endpoint
  async checkEmail(email: string): Promise<ApiResponse<{ exists: boolean; userType: string | null }>> {
    return this.request<{ exists: boolean; userType: string | null }>(
      `/users/check-email?email=${encodeURIComponent(email.trim())}`
    );
  }

  // 6-digit OTP verification endpoint
  async verifyOtp(email: string, code: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const res = await this.request<{ token: string; user: any }>('/users/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });

    if (res.success && res.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('zoodo_user', JSON.stringify(res.data.user));
      }
    }
    return res;
  }

  // OTP Resend endpoint
  async resendOtp(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/users/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Business Profile and Verification Endpoints
  async getBusinessProfile(): Promise<ApiResponse<any>> {
    return this.request('/business/profile');
  }

  async updateBusinessProfile(data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.request('/business/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getBusinessDocuments(): Promise<ApiResponse<any[]>> {
    return this.request('/business/documents');
  }

  async uploadBusinessDocument(formData: FormData): Promise<ApiResponse<any>> {
    return this.request('/business/documents/upload', {
      method: 'POST',
      body: formData,
    });
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
    const isForm = typeof FormData !== 'undefined' && userData instanceof FormData;
    if (isForm) {
      const form = userData as FormData;
      const isBusiness = form.has('businessName') || form.get('userType') === 'business';
      const endpoint = isBusiness ? '/register/business' : '/register/personal';

      return this.request<User>(endpoint, {
        method: 'POST',
        body: form,
      });
    }
    const record = userData as Record<string, any>;
    const endpoint = (record?.businessName || record?.userType === 'business') ? '/register/business' : '/register/personal';
    return this.request<User>(endpoint, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
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

      // Store JWT token and user profile if login is successful
      if (response.success && response.data) {
        if (typeof window !== 'undefined') {
          const rawData = response.data as any;
          const token = typeof rawData === 'string' ? rawData : rawData?.token;
          if (token) {
            localStorage.setItem('jwt_token', token);
          }
          if (rawData?.user) {
            localStorage.setItem('user', JSON.stringify(rawData.user));
          }
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
  }): Promise<ApiResponse<{ token: string; user?: any }>> {
    const response = await this.request<{ token: string; user?: any }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.usernameOrEmail,
        password: credentials.password
      }),
    });

    // Store JWT token if login is successful
    if (response.success && response.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt_token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('zoodo_user', JSON.stringify(response.data.user));
        }
      }
    }

    return response;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
    }
  }

  // Google OAuth / Firebase Handshake
  async authenticateWithGoogle(payload: {
    email: string;
    googleId: string;
    firstName: string;
    lastName: string;
    username?: string;
    profilePhotoUrl?: string;
    userType?: string;
    businessName?: string;
    categories?: string[];
  }): Promise<ApiResponse<{ token: string; user: any }>> {
    const res = await this.request<{ token: string; user: any }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.success && res.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('zoodo_user', JSON.stringify(res.data.user));
      }
    }
    return res;
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

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    // Health endpoint is at /health, not /api/health
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || 'http://127.0.0.1:8000';
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

  // ==========================================
  // SUPER ADMIN COMMAND CENTER METHODS
  // ==========================================
  async getAdminOverview(): Promise<ApiResponse<{
    counts: {
      totalUsers: number;
      totalBusinesses: number;
      verifiedBusinesses: number;
      pendingBusinesses: number;
      totalPets: number;
      totalAppointments: number;
      totalOtps: number;
    };
    users: any[];
    businesses: any[];
    pets: any[];
    appointments: any[];
    otps: any[];
  }>> {
    return this.request<any>('/admin/overview');
  }

  async verifyBusiness(payload: { businessId: string; status: string; notes?: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/verify-business', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async verifyDocument(payload: { documentId: string; status: string; rejectReason?: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/verify-document', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async deleteAdminUser(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async adminClearDatabase(): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/clear-db', {
      method: 'POST',
    });
  }

}

export const apiService = new ApiService(); 