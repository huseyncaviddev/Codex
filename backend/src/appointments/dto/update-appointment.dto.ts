import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';
import { AppointmentStatus } from '../appointment.schema';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsMongoId()
  id: string;

  @IsOptional()
  @IsEnum(['scheduled', 'done', 'cancelled'])
  status?: AppointmentStatus;
}
