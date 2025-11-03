// src/controllers/FolderController.ts
import { Router, Request, Response } from 'express';
import { FolderModel } from '../Infraestructura/database/Esquemas/DirectorioEsquema';
import { PermissionService } from '../services/PermisosService';

const router = Router();
const permissionService = new PermissionService();

// CREATE carpeta
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, parentId, userId } = req.body;
       
        if (!name || !userId) {
            return res.status(400).json({ error: 'name y userId son requeridos' });
        }

        const folder = await FolderModel.create({
            name,
            parentId: parentId || null,
            ownerId: userId
        });

        res.status(201).json(folder);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET carpetas
router.get('/', async (req: Request, res: Response) => {
    try {
        const { parentId } = req.query;
        const folders = await FolderModel.find({
            parentId: parentId === 'root' ? null : parentId
        });
        res.json(folders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;