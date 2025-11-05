import { FolderModel, IFolderDocument } from '../Infraestructura/database/Esquemas/DirectorioEsquema';
import { UsuarioModel } from '../Infraestructura/database/Esquemas/UsuarioEsquema';

export class FolderService {

    constructor() {
    }
    async createFolder(name: string, parentId: string | null, userId: string): Promise<IFolderDocument> {
        if (!name || !userId) {
            throw new Error('name y userId son requeridos');
        }

        // Validar que no sea su propio padre
        if (parentId && parentId === userId) {
            throw new Error('Una carpeta no puede ser su propio padre');
        }

        const folder = await FolderModel.create({
            name,
            parentId: parentId || null,
            ownerId: userId
        });


        return folder;
    }

    async listFolders(parentId?: string | null): Promise<IFolderDocument[]> {
        const filter = {
            parentId: parentId === 'root' || !parentId ? null : parentId
        };
        return await FolderModel.find(filter);
    }

    async deleteFolder(folderId: string, userId: string): Promise<void> {
        const c = await FolderModel.findById(userId);
        /* if (!canDelete) {
            throw new Error('No tienes permiso para eliminar esta carpeta');
        }  */

        await FolderModel.findByIdAndDelete(folderId);
    }
}
