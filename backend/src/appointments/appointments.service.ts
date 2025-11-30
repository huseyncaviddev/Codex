import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument, AppointmentStatus } from './appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<AppointmentDocument>,
    private readonly patientsService: PatientsService,
  ) {}

  private ensureFutureDate(date: Date, status: AppointmentStatus) {
    if (status === 'scheduled' && date.getTime() < Date.now()) {
      throw new BadRequestException('Scheduled appointments must be in the future');
    }
  }

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const patient = await this.patientsService.findOne(dto.patientId);
    if (!patient.isActive) {
      throw new BadRequestException('Patient is inactive');
    }

    const status: AppointmentStatus = dto.status || 'scheduled';
    const date = new Date(dto.date);
    this.ensureFutureDate(date, status);

    const created = new this.appointmentModel({
      ...dto,
      status,
      patientId: new Types.ObjectId(dto.patientId),
      date,
    });
    return created.save();
  }

  async findAll(query: AppointmentQueryDto) {
    const { page = 1, limit = 20, patientId, dateFrom, dateTo, status } = query;
    const filter: FilterQuery<AppointmentDocument> = {};

    if (patientId) {
      filter.patientId = new Types.ObjectId(patientId);
    }
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    if (status) {
      filter.status = status;
    }

    const [items, total] = await Promise.all([
      this.appointmentModel
        .find(filter)
        .populate({ path: 'patientId', select: 'firstName lastName phone' })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ date: 1 })
        .exec(),
      this.appointmentModel.countDocuments(filter).exec(),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: string): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate({ path: 'patientId', select: 'firstName lastName phone' })
      .exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (dto.patientId) {
      await this.patientsService.findOne(dto.patientId);
      appointment.patientId = new Types.ObjectId(dto.patientId);
    }
    if (dto.date) {
      const newDate = new Date(dto.date);
      appointment.date = newDate;
    }
    if (dto.status) {
      appointment.status = dto.status;
    }
    if (dto.reason !== undefined) appointment.reason = dto.reason;
    if (dto.notes !== undefined) appointment.notes = dto.notes;
    if (dto.durationMinutes !== undefined) appointment.durationMinutes = dto.durationMinutes;

    this.ensureFutureDate(appointment.date, appointment.status);

    return appointment.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Appointment not found');
    }
  }
}
