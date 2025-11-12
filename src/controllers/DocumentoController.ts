// src/presentation/controllers/FileController.ts
import { Router, Request, Response } from 'express';
import { FileService } from '../services/DocumentoServices';
import { VersionService } from '../services/VersionService';
import { CompartirService } from '../services/CompartidosService';
import { getIO } from '../socket';
const router = Router();
const fileService = new FileService();
const versionService = new VersionService();

// CREATE archivo
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, folderId, userId} = req.body;
        
        if (!name || !userId) {
            return res.status(400).json({ error: 'name y userId son requeridos' });
        }

        const file = await fileService.createFile(name, folderId || null, userId);
        
        res.status(201).json(file);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET archivo por ID
// GET archivo por ID (propio o compartido)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId es requerido' });
    }

    // 1️⃣ Buscar el archivo
    const file = await fileService.getFile(id);
    if (!file) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    // 2️⃣ Verificar si el usuario es el dueño o si tiene acceso compartido
    const { SharedReferenceModel } = await import('../Infraestructura/database/Esquemas/ISharedReference');

    const esPropietario = file.ownerId.toString() === userId;
    const referenciaCompartida = await SharedReferenceModel.findOne({
      targetId: id,
      sharedWithId: userId,
    });

    if (!esPropietario && !referenciaCompartida) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a este archivo' });
    }

    // 3️⃣ Si pasa las verificaciones, devolver el archivo completo
    res.json(file);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE contenido del archivo
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, content } = req.body;
      console.log('[PUT /files/:id] Body recibido:', req.body);


        if (!userId) {
            return res.status(400).json({ error: 'userId es requerido' });
        }
        const file = await fileService.updateContent(id, content, userId);
        res.json(file);
    } catch (error: any) {
        if (error.message.includes('Conflicto de concurrencia')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// DELETE archivo
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'userId es requerido' });
        }

        await fileService.deleteFile(id, userId as string);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET historial de versiones
router.get('/:id/versions', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const versions = await versionService.getVersionHistory(id);
        res.json(versions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST restaurar versión
router.post('/:id/restore', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { versionId, userId } = req.body;

        if (!versionId || !userId) {
            return res.status(400).json({ error: 'versionId y userId son requeridos' });
        }

        await versionService.restoreVersion(id, versionId, userId);
        res.json({ message: 'Versión restaurada exitosamente' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET archivos de una carpeta (o root)
router.get('/folder/:folderId', async (req: Request, res: Response) => {
    try {
        const { folderId } = req.params;
        const files = await fileService.listByFolder(
            folderId === 'root' ? null : folderId
        );
        res.json(files);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Guardar contenido colaborativo desde Yjs
router.put('/:id/persist', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, content } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: 'userId son requeridos' });
    }

    // Guardar el contenido (sin versionado optimista ni bloqueo)
    const updated = await fileService.saveCollaborativeContent(id, content, userId);

    res.json({
      message: 'Contenido colaborativo guardado correctamente',
      file: updated
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/permisos/:fileId', async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const { userId } = req.query; 
    const ref = await CompartirService.getPermission(String(fileId), String(userId));

    return res.send(ref);
  } catch (error: any) {
    

    return res.status(400);
  }
});


export default router;