// src/presentation/controllers/PermissionController.ts
import { Router, Request, Response } from 'express';
import { PermissionService } from '../services/PermisosService';

const router = Router();
const permissionService = new PermissionService();

// POST compartir recurso
router.post('/', async (req: Request, res: Response) => {
    try {
        const { resourceId, resourceType, targetUser, role, currentUser } = req.body;

        if (!resourceId || !targetUser || !role || !currentUser) {
            return res.status(400).json({ 
                error: 'resourceId, targetUser, role y currentUser son requeridos' 
            });
        }

        await permissionService.shareResource(
            resourceId,
            resourceType || 'file',
            targetUser,
            role,
            currentUser
        );

        res.status(201).json({ message: 'Recurso compartido exitosamente' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET permisos de un recurso
router.get('/:resourceId', async (req: Request, res: Response) => {
    try {
        const { resourceId } = req.params;
        const permissions = await permissionService.getPermissions(resourceId);
        res.json(permissions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;