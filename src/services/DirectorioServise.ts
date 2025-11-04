import { FolderModel, IFolderDocument } from '../Infraestructura/database/Esquemas/DirectorioEsquema';

export class FolderService {

    constructor() {
    }

    /**
     * Crea una nueva carpeta
     */
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

        // // Dar permiso de propietario automáticamente
        // await this.permissionService.shareResource(
        //     folder.id.toString(),
        //     'folder',
        //     userId,
        //     'owner',
        //     userId
        // );

        return folder;
    }

    /**
     * Lista las carpetas dentro de un directorio (o raíz)
     */
    async listFolders(parentId?: string | null): Promise<IFolderDocument[]> {
        const filter = {
            parentId: parentId === 'root' || !parentId ? null : parentId
        };
        return await FolderModel.find(filter);
    }

    /**
     * Elimina una carpeta (si tiene permiso)
     */
    async deleteFolder(folderId: string, userId: string): Promise<void> {
        /* const canDelete = await this.permissionService.checkPermission(userId, folderId, 'delete');
        if (!canDelete) {
            throw new Error('No tienes permiso para eliminar esta carpeta');
        } */

        await FolderModel.findByIdAndDelete(folderId);
    }
}
