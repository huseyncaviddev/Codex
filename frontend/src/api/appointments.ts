import { apiClient } from './client';
import { Appointment, AppointmentStatus, PaginatedResponse } from '../types';

export const appointmentsApi = {
  list: (params?: { patientId?: string; status?: AppointmentStatus; dateFrom?: string; dateTo?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.patientId) searchParams.append('patientId', params.patientId);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.append('dateTo', params.dateTo);
    const query = searchParams.toString();
    return apiClient.get<PaginatedResponse<Appointment>>(`/appointments${query ? `?${query}` : ''}`);
  },
  get: (id: string) => apiClient.get<Appointment>(`/appointments/${id}`),
  create: (payload: Partial<Appointment>) => apiClient.post<Appointment>('/appointments', payload),
  update: (id: string, payload: Partial<Appointment>) => apiClient.patch<Appointment>(`/appointments/${id}`, payload),
  remove: (id: string) => apiClient.delete<void>(`/appointments/${id}`),
};
