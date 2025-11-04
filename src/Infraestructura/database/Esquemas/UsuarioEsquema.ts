import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUsuario extends Document {
  nombreUsuario: string;
  email: string;
  estado: 'activo' | 'inactivo';
  createdAt?: Date;
  updatedAt?: Date;
  carpetaPersonal?: mongoose.Types.ObjectId; // referencia al Directorio
}

// Esquema de Usuario
const UsuarioSchema = new Schema<IUsuario>(
  {
    nombreUsuario: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
    carpetaPersonal: { type: mongoose.Schema.Types.ObjectId, ref: 'Directorio' } // relación
  },
  { timestamps: true }
);

// Índices útiles
UsuarioSchema.index({ email: 1 }, { unique: true });
UsuarioSchema.index({ nombreUsuario: 'text' });


// Export del modelo
export const UsuarioModel: Model<IUsuario> = mongoose.model<IUsuario>('Usuario', UsuarioSchema);

