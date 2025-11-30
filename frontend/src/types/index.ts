export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentStatus = 'scheduled' | 'done' | 'cancelled';

export type Appointment = {
  id: string;
  patientId: string | Patient;
  date: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  durationMinutes?: number;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
