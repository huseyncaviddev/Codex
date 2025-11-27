import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Patient, PatientDocument } from './patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaginationQueryDto } from '../common/pagination.dto';

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient.name) private readonly patientModel: Model<PatientDocument>) {}

  async create(dto: CreatePatientDto): Promise<Patient> {
    const created = new this.patientModel({
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    });
    return created.save();
  }

  async findAll(query: PaginationQueryDto, search?: string) {
    const { page = 1, limit = 20 } = query;
    const filter: FilterQuery<PatientDocument> = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.patientModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.patientModel.countDocuments(filter).exec(),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
    const updatePayload: Partial<Patient> = {
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    };
    const updated = await this.patientModel
      .findByIdAndUpdate(id, updatePayload, { new: true, runValidators: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Patient not found');
    }
    return updated;
  }

  async softDelete(id: string): Promise<Patient> {
    const updated = await this.patientModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Patient not found');
    }
    return updated;
  }
}
