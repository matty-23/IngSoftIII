import mongoose, { Schema, Document } from 'mongoose';

export interface IFileDocument extends Document {
    name: string;
    content: string;
    folderId: mongoose.Types.ObjectId | null;
    ownerId: string;
    state: 'idle' | 'open' | 'editing';
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

const FileSchema = new Schema<IFileDocument>({
    name: { type: String, required: true },
    content: { type: String, default: '' },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    ownerId: { type: String, required: true },
    state: { type: String, enum: ['idle', 'open', 'editing'], default: 'idle' },
    version: { type: Number, default: 1 }
}, { timestamps: true });

export const FileModel = mongoose.model<IFileDocument>('File', FileSchema);
