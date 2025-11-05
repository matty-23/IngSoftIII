import { SharedReferenceModel } from '../Infraestructura/database/Esquemas/ISharedReference';
import { FolderModel } from '../Infraestructura/database/Esquemas/DirectorioEsquema';
import { UsuarioModel } from '../Infraestructura/database/Esquemas/UsuarioEsquema';
import { Compartidos } from '../models/Compartidos';

export class CompartirService {
  static async compartirRecurso(
    ownerId: string,
    targetId: string,
    destinatarioEmail: string,
    permiso: number) {
    const destinatario = await UsuarioModel.findOne({ email: destinatarioEmail });
    if (!destinatario) throw new Error('Usuario destinatario no encontrado');

    const recurso = await FolderModel.findById(targetId);
    if (!recurso) throw new Error('Recurso no encontrado');
    if (recurso.ownerId !== ownerId) throw new Error('No tienes permiso para compartir este recurso');

    const ref = await SharedReferenceModel.create({
      targetId,
      ownerId,
      sharedWithId: destinatario._id,
      permission: permiso,
    });

    const comp = await FolderModel.findById(destinatario.carpetaCompartido);
    if (!comp) throw new Error('El destinatario no tiene carpeta de compartidos');

    // Crear la instancia lógica de la carpeta Compartidos
    const compartido = new Compartidos(
      comp.id.toString(),
      destinatario.id.toString()
    );
    await compartido.addReference(targetId, ref);
    return ref;
  }

  /** 📋 Obtener los recursos compartidos de un usuario */
  static async obtenerCompartidos(userId: string) {
    const refs = await SharedReferenceModel.find({ sharedWithId: userId });
    return refs;
  }

  /** 🔐 Cambiar permisos de un recurso compartido */
  static async cambiarPermiso(targetId: string, sharedWithId: string, nuevoPermiso: number) {
    const ref = await SharedReferenceModel.findOne({ targetId, sharedWithId });
    if (!ref) throw new Error('Referencia no encontrada');
    ref.permission = nuevoPermiso;
    await ref.save();
    return ref;
  }

  /** ❌ Dejar de compartir un recurso */
  static async eliminarCompartido(targetId: string, sharedWithId: string) {
    await SharedReferenceModel.deleteOne({ targetId, sharedWithId });
    return { message: 'Recurso eliminado de compartidos' };
  }
}
