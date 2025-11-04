import mongoose, { Schema, Document, Model } from 'mongoose';
import { DirectorioModel } from '../../models/Directorio'; // 👈 Importá el modelo, no solo la interfaz

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

// 🧩 Hook: crear automáticamente un directorio personal al crear un usuario
UsuarioSchema.post('save', async function (usuario) {
  try {
    if (usuario.carpetaPersonal) return; // ya tiene asignada una

    // Crear directorio base
    const carpetaBase = await DirectorioModel.create({
      nombre: `root_${usuario.nombreUsuario}`,
      ownerId: usuario._id
    });

    // Asignar la carpeta y guardar el usuario
    usuario.carpetaPersonal = carpetaBase._id;
    await usuario.save();
  } catch (err) {
    console.error('Error al crear carpeta personal del usuario:', err);
  }
});

// Export del modelo
export const UsuarioModel: Model<IUsuario> = mongoose.model<IUsuario>('Usuario', UsuarioSchema);

