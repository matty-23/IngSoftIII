import { FileModel } from '../Infraestructura/database/Esquemas/DocumentoEsquema';
import { Documento } from '../models/Documento';
import { IdleState } from '../models/State';
import { EditingState } from '../models/State';
import { EventBus } from '../services/EventBus';
import { FileCreatedEvent, FileSavedEvent, FileDeletedEvent } from '../interfaces/IEvents';

export class FileService {
    private eventBus: EventBus;

    constructor() {
        this.eventBus = EventBus.getInstance();
    }

    // CREATE
    async createFile(name: string, folderId: string | null, userId: string): Promise<Documento> {
        const fileDoc = await FileModel.create({
            name,
            folderId,
            ownerId: userId,
            content: ' ',
            state: 'idle',
            version: 1
        });

        const file = this.mapToEntity(fileDoc);

        // EVENT-DRIVEN: Emitir evento
        this.eventBus.emit('FileCreated', {
            fileId: fileDoc._id,
            fileName: name,
            userId,
            timestamp: new Date()
        } as FileCreatedEvent);

        return file;
    }

    // READ
    async getFile(id: string): Promise<Documento | null> {
        const fileDoc = await FileModel.findById(id);
        if (!fileDoc) return null;
        return this.mapToEntity(fileDoc);
    }

    // UPDATE (con optimistic locking)
    async updateContent(id: string, content: string, userId: string): Promise<Documento> {
        const fileDoc = await FileModel.findById(id);
        if (!fileDoc) throw new Error('Archivo no encontrado');

        // STATE PATTERN: Verificar si puede editar
        const file = this.mapToEntity(fileDoc);
        if (!file.canEdit()) {
            throw new Error('El archivo no puede ser editado en su estado actual');
        }

        // OPTIMISTIC LOCKING
        const currentVersion = fileDoc.version;
        const result = await FileModel.updateOne(
            { _id: id, version: currentVersion },
            {
                $set: { content, state: 'idle' },
                $inc: { version: 1 }
            }
        );

        if (result.modifiedCount === 0) {
            throw new Error('Conflicto de concurrencia: el archivo fue modificado por otro usuario');
        }

        // EVENT-DRIVEN: Emitir evento de guardado
        this.eventBus.emit('FileSaved', {
            fileId: id.toString(),
            fileName: fileDoc.name,
            userId,
            content,
            timestamp: new Date()
        } as FileSavedEvent);

        const updated = await FileModel.findById(id);
        return this.mapToEntity(updated!);
    }

    // DELETE
    async deleteFile(id: string, userId: string): Promise<void> {
        const fileDoc = await FileModel.findById(id);
        if (!fileDoc) throw new Error('Archivo no encontrado');

        // STATE PATTERN: Verificar si puede eliminar
        const file = this.mapToEntity(fileDoc);
        if (!file.canDelete()) {
            throw new Error('El archivo no puede ser eliminado en su estado actual');
        }

        await FileModel.findByIdAndDelete(id);

        // EVENT-DRIVEN: Emitir evento
        this.eventBus.emit('FileDeleted', {
            fileId: id.toString(),
            fileName: fileDoc.name,
            userId,
            timestamp: new Date()
        } as FileDeletedEvent);
    }

    // LIST by folder
    async listByFolder(folderId: string | null): Promise<Documento[]> {
        const files = await FileModel.find({ folderId });
        return files.map(f => this.mapToEntity(f));
    }

    // Helper: Map MongoDB doc to Domain Entity
    private mapToEntity(doc: any): Documento {
        let state;
        switch(doc.state) {
            case 'editing':
                state = new EditingState();
                break;
            case 'idle':
            default:
                state = new IdleState();
        }

        return new Documento(
            doc._id.toString(),
            doc.name,
            doc.content,
            doc.ownerId,
            doc.folderId ? doc.folderId.toString() : null,
            state
        );
    }
}