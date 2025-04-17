import { User } from '@url-shortener/db/generated';
import { Link } from '@url-shortener/shared-types';
import { AuthResponse } from '@url-shortener/shared-types/types/auth-dtos/api-response';
import { LoginDto } from '@url-shortener/shared-types/types/auth-dtos/login.dto';
import { RegisterDto } from '@url-shortener/shared-types/types/auth-dtos/register.dto';
import { CreateLinkDto } from '@url-shortener/shared-types/types/link-dtos/create-link.dtos';
import { SlugAvailabilityResponse } from '@url-shortener/shared-types/types/link-dtos/slug-availability-response';
import { SlugAvailabilityDto } from '@url-shortener/shared-types/types/link-dtos/slug-available.dtos';
import { UpdateLinkDto } from '@url-shortener/shared-types/types/link-dtos/update-link.dtos';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: 'http://localhost:3333/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: (data: LoginDto) => api.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterDto) =>
    api.post<AuthResponse>('/auth/register', data),

  getProfile: () => api.get<User>('/users/'),
};

export const linkApi = {
  createLink: (data: CreateLinkDto) => api.post<Link>('/links', data),

  updateLink: (id: string, data: UpdateLinkDto) =>
    api.patch<Link>(`/links/${id}`, data),

  getMyUrls: () => api.get<Link[]>('/links'),

  checkSlugAvailability: (data: SlugAvailabilityDto) =>
    api.post<SlugAvailabilityResponse>('/slugs/availability', data),
};

export default api;
