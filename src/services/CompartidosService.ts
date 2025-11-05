import { SharedReferenceModel } from '../Infraestructura/database/Esquemas/ISharedReference';
import { FolderModel } from '../Infraestructura/database/Esquemas/DirectorioEsquema';
import { UsuarioModel } from '../Infraestructura/database/Esquemas/UsuarioEsquema';

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

    return ref;
  }
}
