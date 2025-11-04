import { UsuarioModel } from '../Infraestructura/database/Esquemas/UsuarioEsquema';
import { Usuario } from '../models/Usuario';
import { FolderModel } from '../Infraestructura/database/Esquemas/DirectorioEsquema';
import mongoose from 'mongoose';

export class UsuarioService {
    // Crear un nuevo usuario
    async crearUsuario(nombreUsuario: string, email: string): Promise<Usuario> {
  if (!nombreUsuario || !email) {
    throw new Error('nombreUsuario y email son requeridos');
  }

  const existente = await UsuarioModel.findOne({ email });
  if (existente) {
    throw new Error('Ya existe un usuario con ese email');
  }

  const session = await mongoose.startSession();
session.startTransaction();

try {
  // 1. Crear usuario
  const usuarioDoc = await UsuarioModel.create([{ nombreUsuario, email }], { session });

  // 2. Crear carpeta raíz
  const carpetaRaizDoc = await FolderModel.create(
    [{
      name: `Mi Unidad`,
      ownerId: usuarioDoc[0]._id,
      parentId: null,
      type: 'normal'
    }],
    { session }
  );

  // 3. Crear carpeta "Compartidos Conmigo"
  const carpetaCompartidosDoc = await FolderModel.create(
    [{
      name: 'Compartidos Conmigo',
      ownerId: usuarioDoc[0]._id,
      parentId: null,
      type: 'shared'
    }],
    { session }
  );

  // 4. Asignar carpetas al usuario
  await UsuarioModel.updateOne(
    { _id: usuarioDoc[0]._id },
    { 
      carpetaPersonal: carpetaRaizDoc[0]._id,
      carpetaCompartidos: carpetaCompartidosDoc[0]._id
    },
    { session }
  );

  // 5. Confirmar transacción
  await session.commitTransaction();
  session.endSession();

  // 6. Devolver instancia de tu clase Usuario
  return new Usuario(
    usuarioDoc[0].id.toString(),
    usuarioDoc[0].nombreUsuario,
    usuarioDoc[0].email,
    usuarioDoc[0].createdAt,
    usuarioDoc[0].updatedAt,
    carpetaRaizDoc[0].id.toString()
  );

} catch (error) {
  await session.abortTransaction();
  session.endSession();
  throw new Error(`Error al crear usuario: ${error}`);
}

}

    // Obtener todos los usuarios
    async obtenerUsuarios(): Promise<Usuario[]> {
        const usuarios = await UsuarioModel.find();
        return usuarios.map(u => new Usuario(
            u.id.toString(),
            u.nombreUsuario,
            u.email,
            u.createdAt,
            u.updatedAt,
            u.carpetaPersonal?.toString()
        ));}
    

    // Obtener usuario por ID
    async obtenerUsuarioPorId(id: string): Promise<Usuario> {
        const usuario = await UsuarioModel.findById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        return new Usuario(
            usuario.id.toString(),
            usuario.nombreUsuario,
            usuario.email,
            usuario.createdAt,
            usuario.updatedAt,
            usuario.carpetaPersonal?.toString()
        );}
     

    // Actualizar usuario
    async actualizarUsuario(id: string, nombreUsuario?: string, email?: string): Promise<Usuario> {
        const usuario = await UsuarioModel.findByIdAndUpdate(
            id,
            { nombreUsuario, email },
            { new: true }
        );

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        return new Usuario(
            usuario.id.toString(),
            usuario.nombreUsuario,
            usuario.email,
            usuario.createdAt,
            usuario.updatedAt,
            usuario.carpetaPersonal?.toString()
        );
    }

    // Eliminar usuario
    async eliminarUsuario(id: string): Promise<void> {
        const eliminado = await UsuarioModel.findByIdAndDelete(id);
        if (!eliminado) {
            throw new Error('Usuario no encontrado');
        }
    }
}
