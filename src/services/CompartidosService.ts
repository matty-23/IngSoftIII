import { SharedReferenceModel } from '../Infraestructura/database/Esquemas/ISharedReference';
import { FolderModel } from '../Infraestructura/database/Esquemas/DirectorioEsquema';
import { UsuarioModel } from '../Infraestructura/database/Esquemas/UsuarioEsquema';
import { Compartidos } from '../models/Compartidos';
import { FileModel } from '../Infraestructura/database/Esquemas/DocumentoEsquema';

export class CompartirService {
  static async compartirRecurso(
    ownerId: string,
    targetId: string,
    destinatarioEmail: string,
    permiso: number) {
    const destinatario = await UsuarioModel.findOne({ email: destinatarioEmail });
    if (!destinatario) throw new Error('Usuario destinatario no encontrado');
    console.log("📦 Destinatario carpetaCompartido:", destinatario.carpetaCompartidoId);
    let recurso = await FolderModel.findById(targetId);
  console.log("📂 Resultado FolderModel:", recurso ? "✅ encontrado" : "❌ no encontrado");
  if (!recurso) {
    recurso = await FileModel.findById(targetId); // 🔥 se agrega búsqueda en archivos
  }
    if (!recurso) throw new Error('Recurso no encontrado');
    console.log("Primera prueba transcurrida");
    //if (recurso.ownerId !== ownerId) throw new Error('No tienes permiso para compartir este recurso');
  
    const ref = await SharedReferenceModel.create({
      targetId,
      ownerId,
      sharedWithId: destinatario.id,
      permission: permiso,
    });

    const comp = await FolderModel.findById(destinatario.carpetaCompartidoId);
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
/** 📋 Obtener los recursos compartidos de un usuario */
static async obtenerCompartidos(userId: string) {
  const refs = await SharedReferenceModel.find({ sharedWithId: userId });

  const resultados: any[] = [];

  for (const ref of refs) {
    let recurso = await FolderModel.findById(ref.targetId);
    if (!recurso) {
      recurso = await FileModel.findById(ref.targetId);
    }

    if (recurso) {
      resultados.push({
        id: recurso._id,
        name: recurso.name,
        type: recurso.type || 'file',
        ownerId: ref.ownerId,
        permission: ref.permission
      });
    } else {
      console.warn("⚠️ Recurso compartido no encontrado para targetId:", ref.targetId);
    }
  }

  return resultados;
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
