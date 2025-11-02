import mongoose, { Schema, Document } from 'mongoose';

export interface IFolderDocument extends Document {
    name: string;
    parentId: mongoose.Types.ObjectId | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

const FolderSchema = new Schema<IFolderDocument>({
    name: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    ownerId: { type: String, required: true }
}, { timestamps: true });

export const FolderModel = mongoose.model<IFolderDocument>('Folder', FolderSchema);
