import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginDto, 
  RegisterDto, 
  ChangePasswordDto,
  CreateStoreDto,
  User,
  Store,
  Rating,
  CreateRatingDto,
  DashboardStats,
  FilterUsersDto,
  FilterStoresDto,
  UserRole
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async changePassword(passwordData: ChangePasswordDto): Promise<void> {
    await this.api.post('/auth/change-password', passwordData);
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/profile');
    return response.data;
  }

  // User endpoints
  async createUser(userData: RegisterDto & { role: UserRole }): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/users', userData);
    return response.data;
  }

  async getUsers(filters?: FilterUsersDto): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users', { params: filters });
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response: AxiosResponse<DashboardStats> = await this.api.get('/users/dashboard/stats');
    return response.data;
  }

  // Store endpoints
  async createStore(storeData: CreateStoreDto): Promise<Store> {
    const response: AxiosResponse<Store> = await this.api.post('/stores', storeData);
    return response.data;
  }

  async getStores(filters?: FilterStoresDto): Promise<Store[]> {
    const response: AxiosResponse<Store[]> = await this.api.get('/stores', { params: filters });
    return response.data;
  }

  async getStore(id: number): Promise<Store> {
    const response: AxiosResponse<Store> = await this.api.get(`/stores/${id}`);
    return response.data;
  }

  async getMyStores(): Promise<Store[]> {
    const response: AxiosResponse<Store[]> = await this.api.get('/stores/my-stores');
    return response.data;
  }

  async deleteStore(id: number): Promise<void> {
    await this.api.delete(`/stores/${id}`);
  }

  // Rating endpoints
  async createRating(storeId: number, ratingData: CreateRatingDto): Promise<Rating> {
    const response: AxiosResponse<Rating> = await this.api.post(`/ratings/stores/${storeId}`, ratingData);
    return response.data;
  }

  async updateRating(storeId: number, ratingData: CreateRatingDto): Promise<Rating> {
    const response: AxiosResponse<Rating> = await this.api.put(`/ratings/stores/${storeId}`, ratingData);
    return response.data;
  }

  async getStoreRatings(storeId: number): Promise<Rating[]> {
    const response: AxiosResponse<Rating[]> = await this.api.get(`/ratings/stores/${storeId}`);
    return response.data;
  }

  async getMyRating(storeId: number): Promise<Rating | null> {
    try {
      const response: AxiosResponse<Rating> = await this.api.get(`/ratings/my-ratings/stores/${storeId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getMyRatings(): Promise<Rating[]> {
    const response: AxiosResponse<Rating[]> = await this.api.get('/ratings/my-ratings');
    return response.data;
  }

  async deleteRating(storeId: number): Promise<void> {
    await this.api.delete(`/ratings/stores/${storeId}`);
  }

  async getStoreStats(storeId: number): Promise<{
    averageRating: number;
    totalRatings: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const response: AxiosResponse<{
      averageRating: number;
      totalRatings: number;
      ratingDistribution: { [key: number]: number };
    }> = await this.api.get(`/ratings/stores/${storeId}/stats`);
    return response.data;
  }
}

export const apiService = new ApiService();
