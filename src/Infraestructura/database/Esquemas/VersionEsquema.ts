import mongoose, { Schema, Document } from 'mongoose';

export interface IVersionDocument extends Document {
    fileId: mongoose.Types.ObjectId;
    versionNumber: number;
    content: string;
    createdBy: string;
    createdAt: Date;
}

// ✅ Eliminar modelo previo (bypass TS readonly de forma segura)
const deleteModel = (modelName: string) => {
    if (mongoose.models[modelName]) {
        console.warn(`⚠️ Eliminando modelo "${modelName}" previo para forzar recarga`);
        delete (mongoose.models as any)[modelName];
        delete (mongoose.connection.models as any)[modelName];
    }
};

deleteModel('Version');

const VersionSchema = new Schema<IVersionDocument>({
    fileId: { type: Schema.Types.ObjectId, ref: 'File', required: true },
    versionNumber: { type: Number, required: true },
    content: { 
        type: String, 
        required: true, 
        default: ' ' 
    },
    createdBy: { type: String, required: true }
}, { timestamps: true });

VersionSchema.index({ fileId: 1, versionNumber: 1 }, { unique: true });
VersionSchema.index({ fileId: 1, versionNumber: -1 });

const VersionModel = mongoose.model<IVersionDocument>('Version', VersionSchema);

console.log('✅ [DEBUG] VersionModel RECARGADO con default en content1');

export { VersionModel };