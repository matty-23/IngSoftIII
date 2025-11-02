// src/application/services/AuditService.ts
import { AuditLogModel } from '../Infraestructura/database/Esquemas/AuditoriaEsquema';
import { EventBus } from './EventBus';
import { FileCreatedEvent, FileSavedEvent, FileSharedEvent, FileDeletedEvent } from '../interfaces/IEvents';

export class AuditService {
    private eventBus: EventBus;

    constructor() {
        this.eventBus = EventBus.getInstance();
        this.registerEventHandlers();
    }

    // OBSERVER PATTERN: Registrar listeners
    private registerEventHandlers(): void {
        this.eventBus.on('FileCreated', async (event: FileCreatedEvent) => {
            await this.logAction(
                event.userId,
                'create',
                event.fileId,
                'file',
                event.fileName
            );
        });

        this.eventBus.on('FileSaved', async (event: FileSavedEvent) => {
            await this.logAction(
                event.userId,
                'edit',
                event.fileId,
                'file',
                event.fileName
            );
        });

        this.eventBus.on('FileShared', async (event: FileSharedEvent) => {
            await this.logAction(
                event.sharedBy,
                'share',
                event.fileId,
                'file',
                event.fileName
            );
        });

        this.eventBus.on('FileDeleted', async (event: FileDeletedEvent) => {
            await this.logAction(
                event.userId,
                'delete',
                event.fileId,
                'file',
                event.fileName
            );
        });
    }

    async logAction(
        userId: string,
        action: 'create' | 'edit' | 'delete' | 'share' | 'restore',
        resourceId: string,
        resourceType: 'file' | 'folder',
        resourceName: string
    ): Promise<void> {
        await AuditLogModel.create({
            userId,
            action,
            resourceId,
            resourceType,
            resourceName,
            timestamp: new Date()
        });
        console.log(`📋 [AuditService] Registrado: ${userId} -> ${action} -> ${resourceName}`);
    }

    async getAuditLog(filters?: { userId?: string, resourceId?: string }): Promise<any[]> {
        const query: any = {};
        if (filters?.userId) query.userId = filters.userId;
        if (filters?.resourceId) query.resourceId = filters.resourceId;

        const logs = await AuditLogModel.find(query).sort({ timestamp: -1 }).limit(100);
        return logs.map(log => ({
            id: log._id,
            userId: log.userId,
            action: log.action,
            resourceName: log.resourceName,
            timestamp: log.timestamp
        }));
    }
}