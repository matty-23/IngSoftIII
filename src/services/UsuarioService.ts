import { UsuarioModel } from '../Infraestructura/database/Esquemas/UsuarioEsquema';
import { Usuario } from '../models/Usuario';

export class UsuarioService {
    // Crear un nuevo usuario
    async crearUsuario(nombreUsuario: string, email: string): Promise<Usuario> {
        if (!nombreUsuario || !email) {
            throw new Error('nombreUsuario y email son requeridos');
        }

        // Verificar si ya existe un usuario con el mismo email
        const existente = await UsuarioModel.findOne({ email });
        if (existente) {
            throw new Error('Ya existe un usuario con ese email');
        }

        const nuevoUsuario = await UsuarioModel.create({
            nombreUsuario,
            email
        });

        return new Usuario(
            nuevoUsuario._id.toString(),
            nuevoUsuario.nombreUsuario,
            nuevoUsuario.email,
            nuevoUsuario.createdAt,
            nuevoUsuario.updatedAt
        );
    }

    // Obtener todos los usuarios
    async obtenerUsuarios(): Promise<Usuario[]> {
        const usuarios = await UsuarioModel.find();
        return usuarios.map(u => new Usuario(
            u._id.toString(),
            u.nombreUsuario,
            u.email,
            u.createdAt,
            u.updatedAt
        ));
    }

    // Obtener usuario por ID
    async obtenerUsuarioPorId(id: string): Promise<Usuario> {
        const usuario = await UsuarioModel.findById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        return new Usuario(
            usuario._id.toString(),
            usuario.nombreUsuario,
            usuario.email,
            usuario.createdAt,
            usuario.updatedAt
        );
    }

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
            usuario._id.toString(),
            usuario.nombreUsuario,
            usuario.email,
            usuario.createdAt,
            usuario.updatedAt
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
