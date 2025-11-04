import mongoose, { Schema, Document } from 'mongoose';

export interface IFolderDocument extends Document {
    name: string;
    parentId: mongoose.Types.ObjectId | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    type: 'normal' | 'shared';
}

const FolderSchema = new Schema<IFolderDocument>({
  name: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
  ownerId: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['normal', 'shared'], 
    default: 'normal' 
  }
}, { timestamps: true });


FolderSchema.index({ ownerId: 1, parentId: 1 });
FolderSchema.index({ parentId: 1 });

// Validación: No puede ser su propio padre
FolderSchema.pre('save', function (next) {
  const folder = this as IFolderDocument;

  if (folder.parentId && folder.id) {
    if (folder.id.toString() === folder.parentId.toString()) {
      return next(new Error('Una carpeta no puede ser su propio padre'));
    }
  }

  next();
});

export const FolderModel = mongoose.model<IFolderDocument>('Folder', FolderSchema);
