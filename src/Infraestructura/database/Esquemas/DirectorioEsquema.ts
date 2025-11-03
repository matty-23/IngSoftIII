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

FolderSchema.index({ ownerId: 1, parentId: 1 });
FolderSchema.index({ parentId: 1 });

// Validación: No puede ser su propio padre
FolderSchema.pre('save', function(next) {
    if (this.parentId && this._id.equals(this.parentId)) {
        next(new Error('Una carpeta no puede ser su propio padre'));
    }
    next();
});
export const FolderModel = mongoose.model<IFolderDocument>('Folder', FolderSchema);
