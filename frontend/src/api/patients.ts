import { apiClient } from './client';
import { PaginatedResponse, Patient } from '../types';

export const patientsApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    const query = searchParams.toString();
    return apiClient.get<PaginatedResponse<Patient>>(`/patients${query ? `?${query}` : ''}`);
  },
  get: (id: string) => apiClient.get<Patient>(`/patients/${id}`),
  create: (payload: Partial<Patient>) => apiClient.post<Patient>('/patients', payload),
  update: (id: string, payload: Partial<Patient>) => apiClient.patch<Patient>(`/patients/${id}`, payload),
};
