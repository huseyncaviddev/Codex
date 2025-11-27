import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Patient } from '../patients/patient.schema';

export type AppointmentDocument = Appointment & Document;
export type AppointmentStatus = 'scheduled' | 'done' | 'cancelled';

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: Patient.name, required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({
    type: String,
    enum: ['scheduled', 'done', 'cancelled'],
    default: 'scheduled',
  })
  status: AppointmentStatus;

  @Prop()
  reason?: string;

  @Prop()
  notes?: string;

  @Prop({ default: 30 })
  durationMinutes?: number;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
AppointmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
