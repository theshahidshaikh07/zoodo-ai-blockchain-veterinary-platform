const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'pet_owner' | 'veterinarian' | 'trainer' | 'admin';
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
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
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
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
      const endpoint = isVetMultipart ? '/users/register/veterinarian' : '/users/register';
      return this.request<User>(endpoint, {
        method: 'POST',
        body: form,
      });
    }
    return this.request<User>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginUser(credentials: {
    usernameOrEmail: string;
    password: string;
  }): Promise<ApiResponse<string>> {
    // Backend expects { email, password }
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
  }

  async loginAdmin(credentials: {
    usernameOrEmail: string;
    password: string;
  }): Promise<ApiResponse<string>> {
    const response = await this.request<string>('/users/login/admin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store JWT token if login is successful
    if (response.success && response.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt_token', response.data);
      }
    }
    
    return response;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
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

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    // Health endpoint is at /health, not /api/health
    const response = await fetch('http://localhost:8080/health', {
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
}

export const apiService = new ApiService(); 