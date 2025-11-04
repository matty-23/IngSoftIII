// models/SharedReference.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISharedReference extends Document {
  targetId: string,
  ownerId: string;                   // Quien compartió
  sharedWithId: string;              // Quien recibe el acceso
  permission: number;
  createdAt: Date;
  updatedAt: Date;
}

const SharedReferenceSchema = new Schema<ISharedReference>({
  targetId: { type: String, required: true, ref: 'Folder' }, // o 'Fil
  ownerId: { type: String, required: true },
  sharedWithId: { type: String, required: true },
  permission: { type: Number,default: 4 },
}, { timestamps: true });

export const SharedReferenceModel = mongoose.model<ISharedReference>('SharedReference', SharedReferenceSchema);

