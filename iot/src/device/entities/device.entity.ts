import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Device extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string; // Ej: temperature, humidity

  @Prop({
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
    _id: false,
  })
  location?: {
    lat: number;
    lng: number;
  };

  @Prop({ default: 'offline' })
  status: 'online' | 'offline';

  @Prop()
  lastSeen?: Date;

  @Prop({ type: Object })
  config?: Record<string, any>;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
