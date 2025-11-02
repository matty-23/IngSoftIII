import mongoose, { Schema, Document } from 'mongoose';

export interface IPermissionDocument extends Document {
    resourceId: mongoose.Types.ObjectId;
    resourceType: 'file' | 'folder';
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
    createdAt: Date;
}

const PermissionSchema = new Schema<IPermissionDocument>({
    resourceId: { type: Schema.Types.ObjectId, required: true },
    resourceType: { type: String, enum: ['file', 'folder'], required: true },
    userId: { type: String, required: true },
    role: { type: String, enum: ['owner', 'editor', 'viewer'], required: true }
}, { timestamps: true });

export const PermissionModel = mongoose.model<IPermissionDocument>('Permission', PermissionSchema);
