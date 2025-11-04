// src/controllers/FolderController.ts
import { Router, Request, Response } from 'express';
import { FolderService } from '../services/DirectorioServise';

const router = Router();
const folderService = new FolderService();

// CREATE carpeta
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, parentId, userId } = req.body;
        const folder = await folderService.createFolder(name, parentId || null, userId);
        res.status(201).json(folder);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// GET carpetas
router.get('/', async (req: Request, res: Response) => {
    try {
        const { parentId } = req.query;
        const folders = await folderService.listFolders(parentId as string);
        res.json(folders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
