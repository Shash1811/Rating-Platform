export enum UserRole {
  ADMIN = 'admin',
  NORMAL_USER = 'normal_user',
  STORE_OWNER = 'store_owner',
}

export type SortOrder = 'asc' | 'desc';
export type UserSortField = 'name' | 'email' | 'address' | 'role' | 'createdAt';
export type StoreSortField = 'name' | 'email' | 'address' | 'createdAt' | 'averageRating';
export type MyRatingsSortField = 'storeName' | 'storeEmail' | 'rating' | 'createdAt';
export type OwnerStoreSortField = 'name' | 'averageRating' | 'totalRatings';
export type OwnerRatingSortField = 'name' | 'email' | 'rating' | 'createdAt';

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  averageRating?: number;
  totalStores?: number;
  totalRatings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  address: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface CreateStoreDto {
  name: string;
  email: string;
  address: string;
  ownerId: number;
}

export interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  owner: User;
  averageRating?: number;
  ratingUsers?: Array<{
    user: User;
    rating: number;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: number;
  rating: number;
  user: User;
  store: Store;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingDto {
  rating: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface FilterUsersDto {
  name?: string;
  email?: string;
  address?: string;
  role?: UserRole;
  sortBy?: UserSortField;
  sortOrder?: SortOrder;
}

export interface FilterStoresDto {
  name?: string;
  email?: string;
  address?: string;
  sortBy?: StoreSortField;
  sortOrder?: SortOrder;
}
