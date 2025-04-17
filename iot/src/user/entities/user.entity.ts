import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ROLES } from 'src/constants/roles';

@Schema({ collection: 'usuarios', timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  identity: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    type: String, 
    enum: Object.values(ROLES),
    default: ROLES.BASIC 
  })
  role: ROLES;

  @Prop()
  refreshToken: string

  // Opción para relaciones (referencias)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Company' }] })
  companies?: Types.ObjectId[];

  // Opción para datos incrustados (embedding)
  /*
  @Prop({
    type: [{
      companyId: { type: Types.ObjectId, ref: 'Company' },
      roleInCompany: String,
      joinedAt: Date
    }]
  })
  companies?: Array<{
    companyId: Types.ObjectId;
    roleInCompany: string;
    joinedAt: Date;
  }>;
  */

  // Campos automáticos de timestamp (gracias a timestamps: true)
  // createdAt: Date;
  // updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Índices adicionales si son necesarios
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ identity: 1 }, { unique: true });