import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { AppointmentStatus } from '../appointment.schema';

export class CreateAppointmentDto {
  @IsMongoId()
  @IsNotEmpty()
  patientId: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsEnum(['scheduled', 'done', 'cancelled'])
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @Min(1)
  durationMinutes?: number;
}
