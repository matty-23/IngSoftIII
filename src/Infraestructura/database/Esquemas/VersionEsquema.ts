import mongoose, { Schema, Document } from 'mongoose';

export interface IVersionDocument extends Document {
    fileId: mongoose.Types.ObjectId;
    versionNumber: number;
    content: string;
    createdBy: string;
    createdAt: Date;
}

const VersionSchema = new Schema<IVersionDocument>({
    fileId: { type: Schema.Types.ObjectId, ref: 'File', required: true },
    versionNumber: { type: Number, required: true },
    content: { type: String, required: true },
    createdBy: { type: String, required: true }
}, { timestamps: true });
// Índice compuesto único: No puede haber versiones duplicadas del mismo archivo
VersionSchema.index(
    { fileId: 1, versionNumber: 1 }, 
    { unique: true }
);

// Índice para ordenar por versión
VersionSchema.index({ fileId: 1, versionNumber: -1 });
export const VersionModel = mongoose.model<IVersionDocument>('Version', VersionSchema);
