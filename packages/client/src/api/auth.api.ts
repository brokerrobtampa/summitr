import { api } from './client.js';
import type { ApiResponse, AuthResponse, User } from '@summit/shared';

export function login(email: string, password: string) {
  return api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
}

export function register(data: { email: string; username: string; password: string; displayName?: string }) {
  return api.post<ApiResponse<AuthResponse>>('/auth/register', data);
}

export function getMe() {
  return api.get<ApiResponse<User>>('/auth/me');
}
