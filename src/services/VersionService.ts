import mongoose from 'mongoose';
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

  private registerEventHandlers(): void {
    this.eventBus.on('FileCreated', async (event: FileCreatedEvent) => {
      console.log('📜 [VersionService] Creando versión inicial...');
      await this.createVersion(event.fileId, ' ', event.userId);
    });

    this.eventBus.on('FileSaved', async (event: FileSavedEvent) => {
      console.log('📜 [VersionService] Creando nueva versión...');
      await this.createVersion(event.fileId, event.content, event.userId);
    });
  }

  async createVersion(fileId: string, content: string | null | undefined, userId: string): Promise<void> {
    // Normalizar contenido
    const safeContent =
      typeof content === 'string' && content.trim().length > 0 ? content : ' ';

    // ⚙️ Obtener siguiente número de versión de forma segura
    const lastVersion = await VersionModel.findOne({ fileId }).sort({ versionNumber: -1 });
    const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    try {
      await VersionModel.create({
        fileId: new mongoose.Types.ObjectId(fileId),
        versionNumber: nextVersionNumber,
        content: safeContent,
        createdBy: userId,
      });
      console.log(`✅ Versión v${nextVersionNumber} creada para archivo ${fileId}`);
    } catch (err: any) {
      if (err.code === 11000) {
        console.warn(`⚠️ Versión duplicada detectada para ${fileId}, reintentando...`);
        return this.createVersion(fileId, content, userId); // reintento simple
      }
      throw err;
    }
  }

  async getVersionHistory(fileId: string): Promise<any[]> {
    const versions = await VersionModel.find({ fileId }).sort({ versionNumber: -1 });
    return versions.map(v => ({
      id: v._id,
      versionNumber: v.versionNumber,
      content: v.content,
      createdBy: v.createdBy,
      createdAt: v.createdAt,
    }));
  }

  async restoreVersion(fileId: string, versionId: string, userId: string): Promise<void> {
    const version = await VersionModel.findById(versionId);
    if (!version) throw new Error('Versión no encontrada');

    await FileModel.findByIdAndUpdate(fileId, {
      content: version.content,
      $inc: { version: 1 },
    });

    console.log(`✅ Versión v${version.versionNumber} restaurada`);

    this.eventBus.emit('FileSaved', {
      fileId,
      fileName: 'restored',
      userId,
      content: version.content,
      timestamp: new Date(),
    });
  }
}
