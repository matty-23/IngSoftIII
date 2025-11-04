import mongoose, { Schema, Document } from 'mongoose';

export interface IUsuarioDocument {
    nombreUsuario: string;
    email: string;
    estado: 'activo' | 'inactivo';
    createdAt: Date;
    updatedAt: Date;
}

const UsuarioSchema = new Schema<IUsuarioDocument>({
    nombreUsuario: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

// 🔍 Índices para mejorar búsquedas y evitar duplicados
UsuarioSchema.index({ email: 1 }, { unique: true });
UsuarioSchema.index({ nombreUsuario: 'text' });
UsuarioSchema.index({ rol: 1 });

export const UsuarioModel = mongoose.model<IUsuarioDocument>('Usuario', UsuarioSchema);
