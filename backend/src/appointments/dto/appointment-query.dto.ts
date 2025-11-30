import { IsDateString, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination.dto';
import { AppointmentStatus } from '../appointment.schema';

export class AppointmentQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsMongoId()
  patientId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsEnum(['scheduled', 'done', 'cancelled'])
  status?: AppointmentStatus;
}
