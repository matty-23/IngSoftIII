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
    let recurso = await FolderModel.findById(targetId);
  console.log("📂 Resultado FolderModel:", recurso ? "✅ encontrado" : "❌ no encontrado");
  if (!recurso) {
    recurso = await FileModel.findById(targetId); // 🔥 se agrega búsqueda en archivos
  }
    if (!recurso) throw new Error('Recurso no encontrado');
    
    if (recurso.ownerId !== ownerId) throw new Error('No tienes permiso para compartir este recurso');

    const comp = await FolderModel.findById(destinatario.carpetaCompartidoId);
    if (!comp) throw new Error('El destinatario no tiene carpeta de compartidos');

   const ref = await SharedReferenceModel.findOneAndUpdate(
        {
            targetId,
            sharedWithId: destinatario._id,
        },
        {
            $set: {
                ownerId,
                permission: permiso,
                updatedAt: new Date(),
            }
        },
        {
            upsert: true,
            new: true, // retorna el documento modificado/creado
            setDefaultsOnInsert: true,
            runValidators: true
        }
    );
    return ref;
  }

  static async dejarDeCompartirRecurso(
    ownerId: string,
    targetId: string,
    destinatarioEmail: string
): Promise<boolean> {
    const destinatario = await UsuarioModel.findOne({ email: destinatarioEmail });
    if (!destinatario) return false;

    const result = await SharedReferenceModel.deleteOne({
        targetId,
        ownerId, // opcional: asegurar que solo el dueño puede revocar
        sharedWithId: destinatario._id
    });

    return result.deletedCount > 0;
}
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
    static async getPermission(fileId: string, userId: string): Promise<number> {
    const ref = await SharedReferenceModel.findOne({
        targetId: fileId,
        sharedWithId: userId
    }).select('permission').lean(); // solo traemos lo necesario

    if (ref==null){return 7;}
    // Si no existe → permiso 0 (sin acceso)
    return ref ? ref.permission : 0;
}
 
  static async eliminarCompartido(targetId: string, sharedWithId: string) {
    await SharedReferenceModel.deleteOne({ targetId, sharedWithId });
    return { message: 'Recurso eliminado de compartidos' };
  }
}
