import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLogDocument extends Document {
    userId: string;
    action: 'create' | 'edit' | 'delete' | 'share' | 'restore';
    resourceId: mongoose.Types.ObjectId;
    resourceType: 'file' | 'folder';
    resourceName: string;
    timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLogDocument>({
    userId: { type: String, required: true },
    action: { type: String, enum: ['create', 'edit', 'delete', 'share', 'restore'], required: true },
    resourceId: { type: Schema.Types.ObjectId, required: true },
    resourceType: { type: String, enum: ['file', 'folder'], required: true },
    resourceName: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
// Índices para mejorar rendimiento
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ resourceId: 1 });
export const AuditLogModel = mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
