// src/application/services/PermissionService.ts
import { PermissionModel } from '../Infraestructura/database/Esquemas/PermisosEsquema';
import { Permisos } from '../models/Permisos';
import { IPermissionStrategy } from '../interfaces/IPermissionStrategy';
import { OwnerStrategy, ViewerStrategy, EditorStrategy } from '../interfaces/Strategy';
import { EventBus } from './EventBus';
import { FileSharedEvent } from '../interfaces/IEvents';
import { FileModel } from '../Infraestructura/database/Esquemas/DocumentoEsquema';

export class PermissionService {
    private eventBus: EventBus;

    constructor() {
        this.eventBus = EventBus.getInstance();
    }

    // STRATEGY PATTERN: Factory Method
    private getStrategy(role: 'owner' | 'editor' | 'viewer'): IPermissionStrategy {
        switch(role) {
            case 'owner': return new OwnerStrategy();
            case 'editor': return new EditorStrategy();
            case 'viewer': return new ViewerStrategy();
            default: throw new Error(`Rol desconocido: ${role}`);
        }
    }

    // Verificar permiso
    async checkPermission(
        userId: string,
        resourceId: string,
        action: 'read' | 'write' | 'delete' | 'share'
    ): Promise<boolean> {
        // Buscar permiso del usuario sobre el recurso
        const permDoc = await PermissionModel.findOne({ 
            resourceId, 
            userId 
        });

        if (!permDoc) {
            // Si no hay permiso explícito, verificar si es el owner
            const file = await FileModel.findById(resourceId);
            if (file && file.ownerId === userId) {
                // Es el owner, tiene todos los permisos
                const strategy = new OwnerStrategy();
                const permission = new Permisos(
                    'owner',
                    resourceId,
                    'file',
                    userId,
                    'owner',
                    strategy
                );
                return permission.hasPermission(action);
            }
            return false;
        }

        // Crear la estrategia según el rol
        const strategy = this.getStrategy(permDoc.role);
        
        // Crear entidad Permission con la estrategia
        const permission = new Permisos(
            permDoc.id,
            permDoc.resourceId.toString(),
            permDoc.resourceType,
            permDoc.userId,
            permDoc.role,
            strategy
        );

        // Delegar la decisión a la estrategia
        return permission.hasPermission(action);
    }

    // Compartir recurso
    async shareResource(
        resourceId: string,
        resourceType: 'file' | 'folder',
        targetUser: string,
        role: 'owner' | 'editor' | 'viewer',
        currentUser: string
    ): Promise<void> {
        // Verificar que el usuario actual pueda compartir
        const canShare = await this.checkPermission(currentUser, resourceId, 'share');
        if (!canShare) {
            throw new Error('No tienes permiso para compartir este recurso');
        }

        // Crear el permiso
        await PermissionModel.create({
            resourceId,
            resourceType,
            userId: targetUser,
            role
        });

        // Obtener nombre del archivo
        const file = await FileModel.findById(resourceId);
        const fileName = file ? file.name : 'unknown';

        // EVENT-DRIVEN: Emitir evento
        this.eventBus.emit('FileShared', {
            fileId: resourceId,
            fileName,
            sharedWith: targetUser,
            role,
            sharedBy: currentUser,
            timestamp: new Date()
        } as FileSharedEvent);

        console.log(`✅ Recurso compartido: ${targetUser} tiene rol ${role}`);
    }

    // Listar permisos de un recurso
    async getPermissions(resourceId: string): Promise<any[]> {
        const perms = await PermissionModel.find({ resourceId });
        return perms.map(p => ({
            id: p._id,
            userId: p.userId,
            role: p.role
        }));
    }
}