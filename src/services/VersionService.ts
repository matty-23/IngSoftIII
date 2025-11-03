import { VersionModel } from '../Infraestructura/database/Esquemas/VersionEsquema';
import { FileModel } from '../Infraestructura/database/Esquemas/DocumentoEsquema';
import { EventBus } from './EventBus';
import { FileSavedEvent, FileCreatedEvent } from '../interfaces/IEvents';

export class VersionService {
    private eventBus: EventBus;

    constructor() {
        this.eventBus = EventBus.getInstance();
        this.registerEventHandlers();
    }

    // OBSERVER PATTERN: Escuchar eventos
    private registerEventHandlers(): void {
        // Crear versión inicial cuando se crea un archivo
        this.eventBus.on('FileCreated', async (event: FileCreatedEvent) => {
            console.log('📜 [VersionService] Creando versión inicial...');
            await this.createVersion(event.fileId, ' ', event.userId, 1);
        });

        // Crear nueva versión cuando se guarda
        this.eventBus.on('FileSaved', async (event: FileSavedEvent) => {
            console.log('📜 [VersionService] Creando nueva versión...');
            const versions = await this.getVersionHistory(event.fileId);
            const nextVersionNumber = versions.length + 1;
            await this.createVersion(event.fileId, event.content, event.userId, nextVersionNumber);
        });
    }

    // PROTOTYPE PATTERN: Crear versión (clon del archivo)
    async createVersion(
        fileId: string, 
        content: string, 
        userId: string,
        versionNumber: number
    ): Promise<void> {
        await VersionModel.create({
            fileId,
            versionNumber,
            content,
            createdBy: userId
        });
        console.log(`✅ Versión v${versionNumber} creada para archivo ${fileId}`);
    }

    // Ver historial de versiones
    async getVersionHistory(fileId: string): Promise<any[]> {
        const versions = await VersionModel.find({ fileId }).sort({ versionNumber: -1 });
        return versions.map( v => ({
            id: v._id,
            versionNumber: v.versionNumber,
            content: v.content,
            createdBy: v.createdBy,
            createdAt: v.createdAt
        }));
    }

    // Restaurar versión anterior
    async restoreVersion(fileId: string, versionId: string, userId: string): Promise<void> {
        const version = await VersionModel.findById(versionId);
        if (!version) throw new Error('Versión no encontrada');

        // Restaurar contenido en el archivo
        await FileModel.findByIdAndUpdate(fileId, {
            content: version.content,
            $inc: { version: 1 }
        });

        console.log(`✅ Versión v${version.versionNumber} restaurada`);

        // Emitir evento (que creará una nueva versión con el contenido restaurado)
        this.eventBus.emit('FileSaved', {
            fileId,
            fileName: 'restored',
            userId,
            content: version.content,
            timestamp: new Date()
        });
    }
}