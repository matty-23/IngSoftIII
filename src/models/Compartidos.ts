import { Directorio } from './Directorio';
import { Componente } from '../interfaces/Componente';
import { ISharedReference } from '../Infraestructura/database/Esquemas/ISharedReference';
import { FolderModel } from '../Infraestructura/database/Esquemas/DirectorioEsquema';
import { CompartirService  } from '../services/CompartidosService';
import { FileModel } from '../Infraestructura/database/Esquemas/DocumentoEsquema';
import { SharedReferenceModel } from '../Infraestructura/database/Esquemas/ISharedReference';
import { permission, ref } from 'process';
import { error } from 'console';

export class Compartidos extends Directorio {
    constructor(id: string, ownerId: string) {
        super(id, 'Compartidos', ownerId, null);
    }
    async getReference(targetId: string): Promise<ISharedReference | null> {
        return await SharedReferenceModel.findOne({
            targetId,
            sharedWithId: this.ownerId })
    }

    async getPermisoArchivo(targetId: string): Promise<number> {
        const ref = await this.getReference(targetId);
        return ref?.permission ?? 0;
    }

    async changePermission(targetId: string, permiso: number): Promise<boolean> {
        const result = await SharedReferenceModel.updateOne(
            { targetId, sharedWithId: this.ownerId },
            { $set: { permission: permiso } }
        );
        return result.modifiedCount > 0;
    }

    async removeReference(targetId: string): Promise<boolean> {
        const result = await SharedReferenceModel.deleteOne({
            targetId,
            sharedWithId: this.ownerId
        });
        return result.deletedCount > 0;
    }

    async getReferences(): Promise<ISharedReference[]> {
        return await SharedReferenceModel.find({
            sharedWithId: this.ownerId
        })
    }

    async getSubCarpetas(targetId: string): Promise<Componente[]>{
            // Primero: aseguramos que el usuario tiene acceso
            const ref = await this.getReference(targetId);
            if (!ref) return []; // 🔒 sin referencia → sin acceso

            const doc = await FolderModel.findById(targetId);
            if (!doc) return [];

            // Luego creamos el componente — y puedes incluso cargar permisos:
            const dir = new Directorio(
                doc.id.toString(),
                doc.name,
                doc.ownerId,
                doc.parentId?.toString() || null
            );
            // Opcional: inyectar permiso actual desde `ref.permission` al componente
            return dir.getType() === 'folder' ? await dir.getChildren() : [dir];
        
        
    }

    getTipo(): 'shared-folder' {
        return 'shared-folder';
    }
}
