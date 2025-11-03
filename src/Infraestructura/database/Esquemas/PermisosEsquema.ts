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
PermissionSchema.index(
    { resourceId: 1, userId: 1 }, 
    { unique: true }
);

// Índices adicionales
PermissionSchema.index({ userId: 1 });
PermissionSchema.index({ resourceId: 1, resourceType: 1 });
export const PermissionModel = mongoose.model<IPermissionDocument>('Permission', PermissionSchema);
